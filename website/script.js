// Overpass API endpoint
const overpassUrl = "https://overpass-api.de/api/interpreter";

// Define the Overpass query
// This example fetches all nodes with "historic" tag globally
const query = `
    [out:json][timeout:25];
    node["historic"]({{-90,-180,90,180}});
    out body;
`;

// Fetch the data from Overpass API
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
