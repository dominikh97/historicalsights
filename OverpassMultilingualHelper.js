const fetch = globalThis.fetch || require('node-fetch'); // Use native fetch or node-fetch as a fallback

const overpassUrl = "https://overpass-api.de/api/interpreter";

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

// Function to fetch historic sites matching multilingual names
async function fetchMultilingualHistoricSites(searchTerm) {
    const words = searchTerm.trim().split(/\s+/).map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = `^${words.join(".*")}`;

    const queries = {
        node: `
            [out:json][timeout:10];
            node["historic"]
                ["name"~"${regex}",i];
            out body;
        `,
        nodeEn: `
            [out:json][timeout:10];
            node["historic"]
                ["name:en"~"${regex}",i];
            out body;
        `,
        nodeDe: `
            [out:json][timeout:10];
            node["historic"]
                ["name:de"~"${regex}",i];
            out body;
        `,
        way: `
            [out:json][timeout:10];
            way["historic"]
                ["name"~"${regex}",i];
            out body;
        `,
        wayEn: `
            [out:json][timeout:10];
            way["historic"]
                ["name:en"~"${regex}",i];
            out body;
        `,
        wayDe: `
            [out:json][timeout:10];
            way["historic"]
                ["name:de"~"${regex}",i];
            out body;
        `,
        relation: `
            [out:json][timeout:10];
            relation["historic"]
                ["name"~"${regex}",i];
            out body;
        `,
        relationEn: `
            [out:json][timeout:10];
            relation["historic"]
                ["name:en"~"${regex}",i];
            out body;
        `,
        relationDe: `
            [out:json][timeout:10];
            relation["historic"]
                ["name:de"~"${regex}",i];
            out body;
        `,
    };

    // Execute all queries in parallel
    const results = await Promise.all(
        Object.values(queries).map(query => fetchOverpassData(query))
    );

    // Combine results
    const combinedResults = results.flatMap((result, index) =>
        result.elements.map(element => ({
            id: element.id,
            type: ['node', 'nodeEn', 'nodeDe', 'way', 'wayEn', 'wayDe', 'relation', 'relationEn', 'relationDe'][index],
            lat: element.lat,
            lon: element.lon,
            name: element.tags.name || element.tags['name:en'] || element.tags['name:de'] || 'Unnamed',
            historicType: element.tags.historic,
        }))
    );

    return combinedResults;
}

module.exports = { fetchMultilingualHistoricSites };
