const express = require('express');
const cors = require('cors'); // Import the cors package
const fetch = globalThis.fetch || require('node-fetch'); // Use native fetch or node-fetch as a fallback
const { countryCoordinates } = require('./data'); // Import countryCoordinates from data.js

const app = express();
const overpassUrl = "https://overpass-api.de/api/interpreter";

// Enable CORS for your specific origin
app.use(cors({
    origin: 'https://dominikh97.github.io/historicalsights/', // Allow only this origin
}));

// Helper function to query Overpass API
async function fetchOverpassData(query) {
    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch from Overpass API: ${error.message}`);
    }
}

// Endpoint for Level 1: Fetch countries
app.get('/api/countries', (req, res) => {
    res.json(Object.keys(countryCoordinates)); // Only return country names
});

// Endpoint for fetching historic sites by country, historic type, and optional search term
app.get('/api/historic-sites', async (req, res) => {
    const { country, historicType, q: searchTerm } = req.query;

    // Validate inputs: both country and historicType are mandatory
    if (!country || !historicType) {
        return res.status(400).json({ error: 'Both country and historicType are required' });
    }

    // Check if the country exists in countryCoordinates
    if (!countryCoordinates[country]) {
        return res.status(404).json({ error: 'Country not found' });
    }

    // Get the bounding box for the country
    const boundingBox = countryCoordinates[country];
    if (!boundingBox) {
        return res.status(404).json({ error: 'Bounding box for the selected country not found' });
    }

    try {
        // Construct the base Overpass query for node, way, and relation separately
        let nodeQuery = `
            [out:json][timeout:20];
            node["historic"="${historicType}"](${boundingBox});
            out body;
        `;
        let wayQuery = `
            [out:json][timeout:20];
            way["historic"="${historicType}"](${boundingBox});
            out body;
        `;
        let relationQuery = `
            [out:json][timeout:20];
            relation["historic"="${historicType}"](${boundingBox});
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
            wayQuery = `
                [out:json][timeout:20];
                way["historic"="${historicType}"]${searchTermQuery}(${boundingBox});
                out body;
            `;
            relationQuery = `
                [out:json][timeout:20];
                relation["historic"="${historicType}"]${searchTermQuery}(${boundingBox});
                out body;
            `;
        }

        // Fetch data from Overpass API for nodes, ways, and relations
        const nodeData = await fetchOverpassData(nodeQuery);
        const wayData = await fetchOverpassData(wayQuery);
        const relationData = await fetchOverpassData(relationQuery);

        // Combine and process results for nodes, ways, and relations
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

        // Process ways
        wayData.elements.forEach(element => {
            results.push({
                id: element.id,
                type: 'way',
                name: element.tags.name || 'Unnamed',
                name_en: element.tags['name:en'] || 'Unnamed (English)',
                historicType: element.tags.historic,
            });
        });

        // Process relations
        relationData.elements.forEach(element => {
            results.push({
                id: element.id,
                type: 'relation',
                name: element.tags.name || 'Unnamed',
                name_en: element.tags['name:en'] || 'Unnamed (English)',
                historicType: element.tags.historic,
            });
        });

        // Respond with the results
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: `No ${historicType} found in ${country}${searchTerm ? ` matching '${searchTerm}'` : ''}` });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to fetch historic sites',
            details: error.message,
        });
    }
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
