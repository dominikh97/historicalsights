// URLs for Nominatim and Overpass API
const nominatimUrl = "https://nominatim.openstreetmap.org/search";
const overpassUrl = "https://overpass-api.de/api/interpreter";

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

    return fetch(overpassUrl, {
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
        })
        .catch(err => {
            console.error("Error fetching historical sights:", err);
            throw err;
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
