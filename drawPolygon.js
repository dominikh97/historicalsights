// Assuming the function that draws the polygon is already in place
document.getElementById('calculateAndDownloadBtn').addEventListener('click', async () => {
    const selectedNode = getSelectedNode(); // Get the selected node (this should be the node selected by the user)
    
    if (!selectedNode) {
        alert("No node selected.");
        return;
    }

    try {
        // Fetch polygon data based on the selected node
        const polygonData = await fetchPolygonFromWikitext(selectedNode);

        // Draw polygon on the map
        const polygonLayer = L.geoJSON(polygonData).addTo(map);

        // Convert the polygon data into GeoJSON (if it's not already)
        const geojsonData = polygonLayer.toGeoJSON();

        // Trigger download of the GeoJSON file
        downloadGeoJSON(geojsonData);

    } catch (error) {
        console.error('Error calculating polygon:', error);
        alert('Failed to calculate and fetch polygon.');
    }
});

// Function to download the GeoJSON file
function downloadGeoJSON(geojsonData) {
    const blob = new Blob([JSON.stringify(geojsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygon.geojson'; // Set the filename for the downloaded file
    a.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
}

// Simulate a function that fetches the polygon data from Wikitext
async function fetchPolygonFromWikitext(node) {
    // You would replace this with the actual logic to fetch polygon data from Wikitext
    const mockGeoJSON = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-0.1276, 51.5074],
                            [-0.1426, 51.5074],
                            [-0.1426, 51.5154],
                            [-0.1276, 51.5154],
                            [-0.1276, 51.5074]
                        ]
                    ]
                },
                "properties": {
                    "name": "Sample Polygon"
                }
            }
        ]
    };
    return new Promise((resolve) => setTimeout(() => resolve(mockGeoJSON), 1000)); // Simulate async fetch
}
