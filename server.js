const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch || require('node-fetch');
const { countryCoordinates } = require('./data');
const { logInfo, logError } = require('./logger');
const path = require('path');

const app = express();
const overpassUrl = "https://overpass-api.de/api/interpreter";

// Middleware setup
app.use(cors({ origin: ['http://localhost:5000', 'http://localhost:8080', 'https://historicalsights.fly.dev'] }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // For parsing JSON in requests

// Variable to store selected node details
let selectedNodeDetails = null;

// Serve data.js explicitly
app.get('/data.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.js'));
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Historic Sites API. Please use the appropriate endpoints.');
});

// Fetch Overpass data
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

// API endpoints
app.get('/api/countries', (req, res) => {
    res.json(Object.keys(countryCoordinates));
});

app.get('/api/historic-sites', async (req, res) => {
    const { country, historicType, q: searchTerm } = req.query;
    if (!country || !historicType) {
        return res.status(400).json({ error: 'Both country and historicType are required.' });
    }
    if (!countryCoordinates[country]) {
        return res.status(404).json({ error: `Country '${country}' not found.` });
    }

    try {
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
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data', details: error.message });
    }
});

// Store selected node details
app.post('/api/selected-node', (req, res) => {
    const { name, country } = req.body;
    if (!name || !country) {
        return res.status(400).json({ error: 'Both name and country are required.' });
    }

    selectedNodeDetails = { name, country };
    logInfo(`Selected node updated: ${JSON.stringify(selectedNodeDetails)}`);
    res.json({ message: 'Selected node details updated', selectedNodeDetails });
});

// Retrieve selected node details
app.get('/api/selected-node', (req, res) => {
    res.json({ selectedNodeDetails });
});

// Serve fallback SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}/`);
});
