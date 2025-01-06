// Assuming this is the logic when a node (marker) is selected on the map
let selectedMarker = null;

// Handle when a marker is clicked
function onNodeSelect(node) {
    // Store the selected node
    selectedMarker = node;

    // Update the node details in the right panel
    document.getElementById('nodeDetails').textContent = node.name || 'No name available';

    // Show the "Calculate and Download Polygon" button
    document.getElementById('calculateAndDownloadBtn').style.display = 'block';
}

// Event listener for the "Calculate and Download Polygon" button
document.getElementById('calculateAndDownloadBtn').addEventListener('click', async () => {
    if (!selectedMarker) {
        alert('Please select a node first.');
        return;
    }

    try {
        // Fetch the polygon data for the selected marker
        const polygonData = await fetchPolygonFromWikitext(selectedMarker);

        // Draw the polygon on the map
        const polygonLayer = L.geoJSON(polygonData).addTo(map);

        // Convert to GeoJSON
        const geojsonData = polygonLayer.toGeoJSON();

        // Trigger download of the GeoJSON file
        downloadGeoJSON(geojsonData);

    } catch (error) {
        console.error('Error calculating polygon:', error);
        alert('Failed to calculate and fetch polygon.');
    }
});

// Function to download GeoJSON
function downloadGeoJSON(geojsonData) {
    const blob = new Blob([JSON.stringify(geojsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'polygon.geojson'; // Set the filename for the download
    a.click();

    // Cleanup the URL object
    URL.revokeObjectURL(url);
}

// Example function to fetch the polygon based on Wikitext or other logic
async function fetchPolygonFromWikitext(node) {
    // This is a mock function. Replace it with actual logic to fetch polygon data.
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
