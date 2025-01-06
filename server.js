const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch || require('node-fetch');
const { countryCoordinates } = require('./data');
const { logInfo, logError } = require('./logger');
const path = require('path');

const app = express();
const overpassUrl = "https://overpass-api.de/api/interpreter";

// Enable CORS
app.use(cors({ origin: 'https://historicalsights.fly.dev' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve data.js
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

// Endpoint for countries
app.get('/api/countries', (req, res) => {
    res.json(Object.keys(countryCoordinates));
});

// Endpoint for historic sites
app.get('/api/historic-sites', async (req, res) => {
    const { country, historicType, q: searchTerm } = req.query;
    if (!country || !historicType) {
        return res.status(400).json({ error: 'Both country and historicType are required.' });
    }
    if (!countryCoordinates[country]) {
        return res.status(404).json({ error: 'Country not found.' });
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

// Start server on port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
});
