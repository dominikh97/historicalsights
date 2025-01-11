const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch || require('node-fetch');
const { countryCoordinates } = require('./data');
const { logInfo, logError } = require('./logger');
const path = require('path');

const app = express();
const overpassUrl = "https://overpass-api.de/api/interpreter";

// Enable CORS for both local development and the public domain (you can also adjust this for other environments as needed)
app.use(cors({ origin: ['http://localhost:5000', 'http://localhost:8080', 'https://historicalsights.fly.dev'] }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve data.js explicitly (this is used to ensure it's accessible on the front-end)
app.get('/data.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.js'));
});

// Root route (for API documentation or status check)
app.get('/', (req, res) => {
    res.send('Welcome to the Historic Sites API. Please use the appropriate endpoints.');
});

// Fetch Overpass data with retry logic
async function fetchOverpassData(query, retries = 5, delay = 1000) {
    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            body: query,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        if (response.status === 429 && retries > 0) {
            logError('Rate limit hit. Retrying...');
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchOverpassData(query, retries - 1, delay * 2);
        }
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        return await response.json();
    } catch (error) {
        logError(`Overpass API error: ${error.message}`);
        throw error;
    }
}

// Endpoint to get list of countries
app.get('/api/countries', (req, res) => {
    logInfo('Fetching country list.');
    res.json(Object.keys(countryCoordinates));
});

// Endpoint to fetch historic sites
app.get('/api/historic-sites', async (req, res) => {
    const { country, historicType, q: searchTerm } = req.query;

    if (!country || !historicType) {
        return res.status(400).json({ error: 'Both country and historicType are required.' });
    }
    if (!countryCoordinates[country]) {
        return res.status(404).json({ error: `Country '${country}' not found.` });
    }

    try {
        logInfo(`Fetching historic sites for country: ${country}, type: ${historicType}, term: ${searchTerm || 'N/A'}`);
        const boundingBox = countryCoordinates[country];

        let query = `[out:json][timeout:20];node["historic"="${historicType}"](${boundingBox});out body;`;
        if (searchTerm) {
            query = `[out:json][timeout:20];node["historic"="${historicType}"]["name"~"${searchTerm}",i](${boundingBox});out body;`;
        }

        const data = await fetchOverpassData(query);
        const results = data.elements.map(e => ({
            id: e.id,
            type: 'node',
            lat: e.lat,
            lon: e.lon,
            name: e.tags.name || 'Unnamed',
            name_en: e.tags['name:en'] || 'Unnamed (English)',
            historicType: e.tags.historic,
        }));

        logInfo(`Found ${results.length} results.`);
        res.json(results);
    } catch (error) {
        logError(`Error fetching historic sites: ${error.message}`);
        res.status(500).json({ error: 'Error fetching data', details: error.message });
    }
});

// Fallback for undefined routes (e.g., to serve SPA index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add this constant to store the selected node
let selectedNode = null;

// New endpoint to update the selected node
app.post('/api/selected-node', express.json(), (req, res) => {
    const { country, name } = req.body;

    if (!country || !name) {
        return res.status(400).json({ error: 'Both country and name are required.' });
    }

    selectedNode = { country, name };
    logInfo(`Selected node updated: ${JSON.stringify(selectedNode)}`);
    res.json({ success: true, selectedNode });
});

// Endpoint to retrieve the selected node (optional)
app.get('/api/selected-node', (req, res) => {
    if (!selectedNode) {
        return res.status(404).json({ error: 'No node selected yet.' });
    }

    res.json(selectedNode);
});

// Start server on a specified port
const PORT = process.env.PORT || 5000;  // Default to 5000 for local testing
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}/`);
    logInfo(`Server listening on ${PORT}`);
});
