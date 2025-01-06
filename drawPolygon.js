// Function to parse WikiText and generate polygon boundaries
function parseWikiTextToBounds(wikiText, lat, lon) {
    // For simplicity, let's assume we can extract a bounding box or coordinates from the WikiText.
    // If we can't extract data, we will fallback to a rectangle.
    
    // Sample regex to match any coordinates or bounding box data in WikiText (adjust based on actual WikiText format)
    const boundsRegex = /bbox\s*=\s*\[([^\]]+)\]/i;
    const match = wikiText.match(boundsRegex);
    
    if (match) {
        const coordinates = match[1].split(',').map(coord => parseFloat(coord.trim()));
        if (coordinates.length === 4) {
            // We have a valid bounding box with [minLon, minLat, maxLon, maxLat]
            return [
                [coordinates[1], coordinates[0]],  // [minLat, minLon]
                [coordinates[3], coordinates[2]],  // [maxLat, maxLon]
            ];
        }
    }

    // If no valid bounding box is found, fallback to a rectangular polygon around the node
    const latOffset = 0.1;  // 10km offset
    const lonOffset = 0.1;  // 10km offset
    return [
        [lat - latOffset, lon - lonOffset],  // Lower left
        [lat - latOffset, lon + lonOffset],  // Lower right
        [lat + latOffset, lon + lonOffset],  // Upper right
        [lat + latOffset, lon - lonOffset],  // Upper left
    ];
}

// Function to create and download a polygon
function createPolygon(node) {
    const lat = node.lat;
    const lon = node.lon;
    const name = node.name || 'Unnamed Node';

    // Fetch WikiText information based on node
    fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${encodeURIComponent(name)}&exintro&explaintext`)
        .then(response => response.json())
        .then(data => {
            const page = Object.values(data.query.pages)[0];
            const wikiText = page.extract || '';
            const bounds = parseWikiTextToBounds(wikiText, lat, lon);
            
            // Create the polygon from bounds
            const polygon = L.polygon(bounds, {
                color: 'blue',
                weight: 2,
                fillOpacity: 0.4,
            }).addTo(map);
            
            // Center the map on the polygon
            map.fitBounds(polygon.getBounds());

            // Prepare GeoJSON data for download
            const geojson = polygon.toGeoJSON();
            downloadGeoJSON(geojson);
        })
        .catch(error => {
            console.error('Error fetching WikiText data:', error);
            // If fetch fails, fall back to a simple rectangle
            const fallbackBounds = [
                [lat - 0.1, lon - 0.1],  // Lower left
                [lat - 0.1, lon + 0.1],  // Lower right
                [lat + 0.1, lon + 0.1],  // Upper right
                [lat + 0.1, lon - 0.1],  // Upper left
            ];
            const fallbackPolygon = L.polygon(fallbackBounds, {
                color: 'blue',
                weight: 2,
                fillOpacity: 0.4,
            }).addTo(map);
            map.fitBounds(fallbackPolygon.getBounds());

            // Prepare GeoJSON data for download
            const geojson = fallbackPolygon.toGeoJSON();
            downloadGeoJSON(geojson);
        });
}

// Function to trigger download of the GeoJSON
function downloadGeoJSON(geojson) {
    const blob = new Blob([JSON.stringify(geojson)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygon.geojson';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Attach event listener to the "Calculate and Fetch Polygon" button
document.getElementById('polygonBtn').addEventListener('click', function() {
    const selectedNode = window.selectedNode;  // Assume this is the selected marker's data
    if (selectedNode) {
        createPolygon(selectedNode);
    }
});
