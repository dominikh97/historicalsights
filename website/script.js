// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Default view to show the whole world

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Overpass API endpoint
const overpassUrl = "https://overpass-api.de/api/interpreter";

// Define the Overpass query
const query = `
    [out:json][timeout:25];
    node["historic"]({{-90,-180,90,180}});
    out body;
`;

// Fetch data from Overpass API
fetch(overpassUrl, {
    method: "POST",
    body: query,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
})
    .then(response => response.json())
    .then(data => {
        // Convert Overpass data to GeoJSON format
        const geojson = {
            type: "FeatureCollection",
            features: data.elements.map(el => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [el.lon, el.lat]
                },
                properties: el.tags
            }))
        };

        // Add GeoJSON data to the map
        L.geoJSON(geojson, {
            onEachFeature: function (feature, layer) {
                // Add popups with feature information
                const name = feature.properties.name || "Unknown Name";
                const historic = feature.properties.historic || "Historic Site";
                layer.bindPopup(`<b>${name}</b><br>${historic}`);
            },
            pointToLayer: function (feature, latlng) {
                // Customize marker appearance
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(map);
    })
    .catch(err => console.error("Error fetching data:", err));
