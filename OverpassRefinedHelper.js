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

// Function to fetch historic sites where names match the search term
async function fetchHistoricSites(searchTerm) {
    // Escape special regex characters and split the term into words
    const words = searchTerm.trim().split(/\s+/).map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    
    // Create a regex for Overpass that matches names starting with the first word and subsequent words in order
    const regex = `^${words.join(".*")}`;

    const queries = {
        node: `
            [out:json][timeout:10];
            node["historic"]["name"~"${regex}",i]; // Match names starting with the first word and containing the others in order
            out body;
        `,
        way: `
            [out:json][timeout:10];
            way["historic"]["name"~"${regex}",i];
            out body;
        `,
        relation: `
            [out:json][timeout:10];
            relation["historic"]["name"~"${regex}",i];
            out body;
        `,
    };

    // Fetch data for nodes, ways, and relations in parallel
    const [nodeData, wayData, relationData] = await Promise.all([
        fetchOverpassData(queries.node),
        fetchOverpassData(queries.way),
        fetchOverpassData(queries.relation),
    ]);

    // Combine results
    const combinedResults = [
        ...nodeData.elements.map(element => ({
            id: element.id,
            type: 'node',
            lat: element.lat,
            lon: element.lon,
            name: element.tags.name || 'Unnamed',
            historicType: element.tags.historic,
        })),
        ...wayData.elements.map(element => ({
            id: element.id,
            type: 'way',
            name: element.tags.name || 'Unnamed',
            historicType: element.tags.historic,
        })),
        ...relationData.elements.map(element => ({
            id: element.id,
            type: 'relation',
            name: element.tags.name || 'Unnamed',
            historicType: element.tags.historic,
        })),
    ];

    return combinedResults;
}

module.exports = { fetchHistoricSites };
