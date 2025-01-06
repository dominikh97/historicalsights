// Global variables (assuming the map is initialized globally from map.js)
let selectedNode = null;  // Store the selected node
let polygonLayer = null;  // Store the drawn polygon layer

// Function to handle node selection
function onNodeSelect(node) {
    selectedNode = node;
    const nodeDetails = document.getElementById('nodeDetails');
    nodeDetails.innerHTML = `<strong>Name:</strong> ${node.name}<br><strong>Type:</strong> ${node.historicType}`;

    // Optionally show the Wikitext here or handle data fetch
    fetchWikitext(node.name);
}

// Function to fetch Wikitext or related information for the selected node
async function fetchWikitext(nodeName) {
    try {
        // Example Wikitext URL (you could replace this with your actual data)
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(nodeName)}&prop=revisions&rvprop=content`;

        // Fetching Wikitext (this is just an example)
        const response = await fetch(wikiUrl);
        const data = await response.json();
        
        const page = data.query.pages;
        const pageId = Object.keys(page)[0];
        const content = page[pageId].revisions[0]['*'];

        console.log('Wikitext content:', content);

        // Parse Wikitext content for polygon coordinates (if present)
        const coordinates = extractCoordinatesFromWikitext(content);
        if (coordinates) {
            // If coordinates are found, draw the polygon
            drawPolygon(coordinates);
        } else {
            alert('No polygon coordinates found for this node.');
        }
    } catch (error) {
        console.error('Error fetching Wikitext:', error);
        alert('Could not fetch Wikitext data.');
    }
}

// Function to extract coordinates from Wikitext (this is a simple example, it might need more specific parsing)
function extractCoordinatesFromWikitext(wikitext) {
    // Example: Look for coordinates in the Wikitext (you may want to refine this based on actual structure)
    const coordinateRegex = /(\d+\.\d+)\s*,\s*(\d+\.\d+)/g; // Matches decimal coordinates
    const coordinates = [];
    let match;

    while ((match = coordinateRegex.exec(wikitext)) !== null) {
        coordinates.push([parseFloat(match[1]), parseFloat(match[2])]);
    }

    return coordinates.length > 0 ? coordinates : null;
}

// Function to draw the polygon on the map
function drawPolygon(coordinates) {
    // If a polygon is already drawn, remove it
    if (polygonLayer) {
        polygonLayer.remove();
    }

    // Create GeoJSON polygon from coordinates
    const polygonGeoJSON = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
        },
    };

    // Create a new polygon layer and add it to the map
    polygonLayer = L.geoJSON(polygonGeoJSON, {
        style: {
            color: 'blue',
            weight: 2,
            opacity: 0.5,
            fillColor: 'blue',
            fillOpacity: 0.2,
        },
    }).addTo(map);

    // Optionally, zoom the map to the polygon bounds
    map.fitBounds(polygonLayer.getBounds());
}
