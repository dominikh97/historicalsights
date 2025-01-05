const express = require('express');
const cors = require('cors'); // Import the cors package
const fetch = globalThis.fetch || require('node-fetch'); // Use native fetch or node-fetch as a fallback
const { countryCoordinates } = require('./data'); // Import countryCoordinates from data.js
const { logInfo, logError } = require('./logger'); // Import logging functions

const app = express();
const overpassUrl = "https://overpass-api.de/api/interpreter";

// Enable CORS for your specific origin
app.use(cors({
    origin: 'https://dominikh97.github.io', // Allow only this origin
}));

// Helper function to query Overpass API with retry logic
async function fetchOverpassData(query, retries = 5, delay = 1000) {
    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // If 429 status code is received, apply backoff
        if (response.status === 429) {
            logError('Rate limit exceeded. Retrying...');
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
                return fetchOverpassData(query, retries - 1, delay * 2); // Retry with exponential backoff
            } else {
                throw new Error('Max retries reached. Unable to fetch data.');
            }
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        logError(`Failed to fetch from Overpass API: ${error.message}`);
        throw new Error(`Failed to fetch from Overpass API: ${error.message}`);
    }
}

// Endpoint for Level 1: Fetch countries
app.get('/api/countries', (req, res) => {
    logInfo('Request received for /api/countries');
    res.json(Object.keys(countryCoordinates)); // Only return country names
});

// Endpoint for fetching historic sites by country, historic type, and optional search term
app.get('/api/historic-sites', async (req, res) => {
    const { country, historicType, q: searchTerm } = req.query;

    // Validate inputs: both country and historicType are mandatory
    if (!country || !historicType) {
        logError('Missing country or historicType in request');
        return res.status(400).json({ error: 'Both country and historicType are required' });
    }

    // Check if the country exists in countryCoordinates
    if (!countryCoordinates[country]) {
        logError(`Country ${country} not found in coordinates`);
        return res.status(404).json({ error: 'Country not found' });
    }

    // Get the bounding box for the country
    const boundingBox = countryCoordinates[country];
    if (!boundingBox) {
        logError(`Bounding box for country ${country} not found`);
        return res.status(404).json({ error: 'Bounding box for the selected country not found' });
    }

    try {
        logInfo(`Fetching historic sites for country: ${country}, type: ${historicType}, search term: ${searchTerm || 'N/A'}`);

        // Construct the base Overpass query for node only (removed ways and relations)
        let nodeQuery = `
            [out:json][timeout:20];
            node["historic"="${historicType}"](${boundingBox});
            out body;
        `;

        // If a search term is provided, filter by the 'name' or 'name:en' tag (case-insensitive)
        if (searchTerm) {
            const searchTermQuery = `["name"~"${searchTerm}",i]["name:en"~"${searchTerm}",i]`;
            nodeQuery = `
                [out:json][timeout:20];
                node["historic"="${historicType}"]${searchTermQuery}(${boundingBox});
                out body;
            `;
        }

        // Fetch data from Overpass API for nodes only
        const nodeData = await fetchOverpassData(nodeQuery);

        // Combine and process results for nodes only
        const results = [];

        // Process nodes
        nodeData.elements.forEach(element => {
            results.push({
                id: element.id,
                type: 'node',
                lat: element.lat,
                lon: element.lon,
                name: element.tags.name || 'Unnamed',
                name_en: element.tags['name:en'] || 'Unnamed (English)',
                historicType: element.tags.historic,
            });
        });

        // Respond with the results
        if (results.length > 0) {
            logInfo(`Found ${results.length} results for ${historicType} in ${country}${searchTerm ? ` matching '${searchTerm}'` : ''}`);
            res.json(results);
        } else {
            logInfo(`No results found for ${historicType} in ${country}${searchTerm ? ` matching '${searchTerm}'` : ''}`);
            res.status(404).json({ message: `No ${historicType} found in ${country}${searchTerm ? ` matching '${searchTerm}'` : ''}` });
        }
    } catch (error) {
        logError(`Error fetching historic sites for ${country}: ${error.message}`);
        res.status(500).json({
            error: 'Failed to fetch historic sites',
            details: error.message,
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
