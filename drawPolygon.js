// Function to generate a polygon based on node info
function generatePolygon(lat, lon, info) {
    // Default radius (e.g., 1000 meters, roughly 1km) for circular polygon
    const defaultRadius = 0.01;  // ~1km radius (approx 0.01° in both lat and lon)
    
    // If we have more specific information (like area, type), we can adjust the polygon size
    const radius = info && info.area ? info.area : defaultRadius;  // Adjust based on the data, if available

    // Calculate the bounds of the polygon. In this case, we generate a circular-like shape.
    const latLngs = [];
    const numPoints = 36;  // Number of points for the circle (increased for smoother results)

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * (2 * Math.PI); // Full circle
        const dx = radius * Math.cos(angle);
        const dy = radius * Math.sin(angle);
        
        // Append the points around the center (lat, lon)
        latLngs.push([lat + dy, lon + dx]);
    }

    // Create a polygon using the generated points
    return L.polygon(latLngs, {
        color: 'blue',
        weight: 2,
        fillOpacity: 0.4,
    });
}

// Function to create and download the polygon
function createPolygon(node) {
    const lat = node.lat;
    const lon = node.lon;
    const name = node.name || 'Unnamed Node';

    // Fetch additional information (like area or type) for refining the polygon
    fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=${encodeURIComponent(name)}&exintro&explaintext`)
        .then(response => response.json())
        .then(data => {
            const page = Object.values(data.query.pages)[0];
            const wikiText = page.extract || '';

            // Determine polygon size based on available info
            const info = {
                area: parseFloat(wikiText.match(/area\s*=\s*(\d+(\.\d+)?)/i)?.[1]) || 0.01, // Default fallback to small area
            };

            const polygon = generatePolygon(lat, lon, info);
            polygon.addTo(map);

            // Center map to the polygon
            map.fitBounds(polygon.getBounds());

            // Prepare the GeoJSON data for download
            const geojson = polygon.toGeoJSON();
            downloadGeoJSON(geojson);
        })
        .catch(error => {
            console.error('Error fetching WikiText data:', error);
            
            // If fetch fails, create a default polygon without detailed data
            const defaultPolygon = generatePolygon(lat, lon, {});
            defaultPolygon.addTo(map);
            map.fitBounds(defaultPolygon.getBounds());

            // Prepare the GeoJSON data for download
            const geojson = defaultPolygon.toGeoJSON();
            downloadGeoJSON(geojson);
        });
}

// Function to trigger download of GeoJSON data
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
    const selectedNode = window.selectedNode;  // Assuming this is the selected marker's data
    if (selectedNode) {
        createPolygon(selectedNode);
    }
});
