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

    // Function to fetch historical sights based on user input
function searchHistoricalSights(place) {
    const overpassUrl = "https://overpass-api.de/api/interpreter";

    // Query to search for historical sights in a specific area (bounding box)
    const query = `
        [out:json][timeout:25];
        area[name="${place}"]->.searchArea;
        (
            node["historic"](area.searchArea);
            way["historic"](area.searchArea);
            relation["historic"](area.searchArea);
        );
        out body;
        >;
        out skel qt;
    `;

    // Show loading indicator (optional)
    const loading = document.createElement('div');
    loading.id = "loading";
    loading.innerText = "Loading historical sights...";
    document.body.appendChild(loading);

    // Fetch the data from Overpass API
    fetch(overpassUrl, {
        method: "POST",
        body: query,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
        .then(response => response.json())
        .then(data => {
            // Remove loading indicator
            document.body.removeChild(loading);

            if (!data.elements || data.elements.length === 0) {
                alert("No historical sights found for the entered location.");
                return;
            }

            // Convert Overpass data to GeoJSON format
            const geojson = {
                type: "FeatureCollection",
                features: data.elements.map(el => {
                    const type = el.type === "node" ? "Point" : "Polygon";
                    const coordinates =
                        type === "Point" ? [el.lon, el.lat] : el.geometry.map(g => [g.lon, g.lat]);
                    return {
                        type: "Feature",
                        geometry: { type, coordinates },
                        properties: el.tags
                    };
                })
            };

            // Clear existing layers
            map.eachLayer(layer => {
                if (layer instanceof L.GeoJSON) map.removeLayer(layer);
            });

            // Add GeoJSON data to the map
            L.geoJSON(geojson, {
                onEachFeature: function (feature, layer) {
                    const name = feature.properties.name || "Unknown Name";
                    const historic = feature.properties.historic || "Historic Site";
                    layer.bindPopup(`<b>${name}</b><br>${historic}`);
                },
                pointToLayer: function (feature, latlng) {
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
        .catch(err => {
            console.error("Error fetching data:", err);
            alert("Failed to fetch historical sights. Please try again.");
        });
}

// Add event listener to the search button
document.getElementById("search-button").addEventListener("click", () => {
    const place = document.getElementById("search-box").value.trim();
    if (place === "") {
        alert("Please enter a place to search.");
        return;
    }
    searchHistoricalSights(place);
});

// URLs for Nominatim and Overpass API
const nominatimUrl = "https://nominatim.openstreetmap.org/search";
const overpassUrl_int = "https://overpass-api.de/api/interpreter";

// Fetch bounding box from Nominatim
function fetchBoundingBox(place) {
    const params = new URLSearchParams({
        q: place, // User input
        format: "json",
        addressdetails: 1,
        limit: 1 // Restrict to top result
    });

    return fetch(`${nominatimUrl}?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                throw new Error("Location not found. Please refine your search.");
            }

            const bbox = data[0].boundingbox;
            return bbox; // [south, north, west, east]
        });
}

// Fetch historical sights from Overpass using the bounding box
function fetchHistoricalSights(bbox) {
    const query = `
        [out:json][timeout:25];
        (
            node["historic"](${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]});
            way["historic"](${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]});
            relation["historic"](${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]});
        );
        out body;
        >;
        out skel qt;
    `;

    return fetch(overpassUrl_int, {
        method: "POST",
        body: query,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.elements || data.elements.length === 0) {
                throw new Error("No historical sights found in this area.");
            }

            // Convert Overpass data to GeoJSON format
            const geojson = {
                type: "FeatureCollection",
                features: data.elements.map(el => {
                    const type = el.type === "node" ? "Point" : "Polygon";
                    const coordinates =
                        type === "Point" ? [el.lon, el.lat] : el.geometry.map(g => [g.lon, g.lat]);
                    return {
                        type: "Feature",
                        geometry: { type, coordinates },
                        properties: el.tags
                    };
                })
            };

            return geojson;
        });
}

// Search function triggered by the search button
function searchPlaceAndSights(place) {
    if (!place) {
        alert("Please enter a location.");
        return;
    }

    // Show loading message
    const loading = document.createElement("div");
    loading.id = "loading";
    loading.innerText = "Searching...";
    document.body.appendChild(loading);

    // Fetch bounding box and then historical sights
    fetchBoundingBox(place)
        .then(bbox => fetchHistoricalSights(bbox))
        .then(geojson => {
            // Remove loading message
            document.body.removeChild(loading);

            // Clear existing layers
            map.eachLayer(layer => {
                if (layer instanceof L.GeoJSON) map.removeLayer(layer);
            });

            // Add new GeoJSON layer to the map
            L.geoJSON(geojson, {
                onEachFeature: function (feature, layer) {
                    const name = feature.properties.name || "Unknown Name";
                    const historic = feature.properties.historic || "Historic Site";
                    layer.bindPopup(`<b>${name}</b><br>${historic}`);
                },
                pointToLayer: function (feature, latlng) {
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
        .catch(err => {
            // Remove loading message and show error
            if (document.getElementById("loading")) {
                document.body.removeChild(loading);
            }
            alert(err.message || "An error occurred while searching.");
            console.error(err);
        });
}

// Attach event listener to the search button
document.getElementById("search-button").addEventListener("click", () => {
    const place = document.getElementById("search-box").value.trim();
    searchPlaceAndSights(place);
});
