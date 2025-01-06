// Initialize map
const map = L.map('map').setView([20, 0], 2);  // Default to global view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Variable to hold the currently selected node
let selectedNode = null;

// Populate country dropdown from data.js (loaded from 'data.js' script)
const countryDropdown = document.getElementById('country');
Object.keys(countryCoordinates).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
});

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', async () => {
    const country = countryDropdown.value;
    const historicType = document.getElementById('historicType').value;

    if (!country || !historicType) {
        alert('Please select both country and historic type.');
        return;
    }

    try {
        // Fetch data from the backend API
        const response = await fetch(`http://localhost:5000/api/historic-sites?country=${encodeURIComponent(country)}&historicType=${encodeURIComponent(historicType)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.length === 0) {
            alert(`No results found for ${historicType} in ${country}.`);
            return;
        }

        // Clear existing markers from map
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for each result
        data.forEach(site => {
            if (site.lat && site.lon) {
                const popupContent = `
                    <strong>${site.name || 'Unnamed'}</strong><br>
                    English Name: ${site.name_en || 'N/A'}<br>
                    Type: ${site.historicType}<br>
                    <a href="https://www.openstreetmap.org/${site.type}/${site.id}" target="_blank">View on OSM</a>
                `;
                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);
                marker.on('click', () => {
                    selectedNode = { lat: site.lat, lon: site.lon, name: site.name };
                    document.getElementById('nodeDetails').textContent = `Node: ${site.name || 'Unnamed'}, Coordinates: (${site.lat}, ${site.lon})`;

                    // Show the polygon button when a node is selected
                    document.getElementById('polygonBtn').style.display = 'block';
                });
            }
        });

        // Zoom to first result
        const firstResult = data.find(site => site.lat && site.lon);
        if (firstResult) {
            map.setView([firstResult.lat, firstResult.lon], 10);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch historic sites. Please try again later.');
    }
});

// Attach event listener to the "Calculate and Fetch Polygon" button
document.getElementById('polygonBtn').addEventListener('click', function() {
    if (selectedNode) {
        createPolygon(selectedNode);
    } else {
        alert('Please select a node first.');
    }
});

// Function to generate and draw the polygon based on the selected node
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

            // Default fallback for polygon size if no additional info is found
            let info = { area: 0.01 };  // Fallback to a small polygon if no area is found

            // You can extend this to extract more detailed data from the wikitext
            // For now, we look for a simple pattern for the area
            const areaMatch = wikiText.match(/area\s*=\s*(\d+(\.\d+)?)/i);
            if (areaMatch) {
                info.area = parseFloat(areaMatch[1]);
            }

            // Generate polygon coordinates based on the selected node and info
            const polygon = generatePolygon(lat, lon, info);
            polygon.addTo(map);

            // Optionally, you can zoom into the polygon once it's drawn
            map.fitBounds(polygon.getBounds());
        })
        .catch(err => {
            console.error('Error fetching Wikipedia data:', err);
            alert('Failed to fetch detailed information for the polygon.');
        });
}

// Helper function to generate a polygon (for now, a simple rectangular polygon)
function generatePolygon(lat, lon, info) {
    const offset = info.area * 1000; // Convert the area factor into lat/lon offset
    const bounds = [
        [lat - offset, lon - offset],
        [lat + offset, lon + offset]
    ];

    // Return a rectangular polygon for now, using the generated bounds
    const polygon = L.polygon([
        [lat - offset, lon - offset],
        [lat + offset, lon - offset],
        [lat + offset, lon + offset],
        [lat - offset, lon + offset]
    ], {
        color: 'blue',
        weight: 2,
        fillOpacity: 0.3
    });

    return polygon;
}
