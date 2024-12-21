// Function to search for a location and update the map view
function searchLocation(query) {
    // Nominatim API URL for geocoding (location search)
    const nominatimUrl = "https://nominatim.openstreetmap.org/search";
    
    // Fetch location data from Nominatim
    const params = new URLSearchParams({
        q: query, // User's search query
        format: "json",
        addressdetails: 1,
        limit: 5, // Get up to 5 suggestions
        tag: "historic" // Ensure it only searches places with historic=*
    });

    fetch(`${nominatimUrl}?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("No historic places found. Please refine your search.");
                return;
            }

            const location = data[0];
            const lat = location.lat;
            const lon = location.lon;

            // Center the map on the found location and zoom in
            map.setView([lat, lon], 13);

            // Optional: Add a marker to the found location
            L.marker([lat, lon]).addTo(map)
                .bindPopup(`Location: ${location.display_name}`)
                .openPopup();

            // Now, fetch historical sites (historic=*) around the location
            fetchHistoricalSights(lat, lon);
        })
        .catch(err => {
            console.error("Error fetching location:", err);
            alert("Error occurred while searching for the location.");
        });
}

// Function to fetch historical sights from Overpass API
function fetchHistoricalSights(lat, lon) {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const radius = 10000; // Search within a 10km radius

    // Construct Overpass query to search for historic=* nodes within a radius of the location
    const query = `
        [out:json][timeout:25];
        (
            node["historic"](around:${radius},${lat},${lon});
            way["historic"](around:${radius},${lat},${lon});
            relation["historic"](around:${radius},${lat},${lon});
        );
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
            if (data.elements.length === 0) {
                alert("No historical sights found in this area.");
                return;
            }

            // Add the historical sights to the map as markers
            data.elements.forEach(element => {
                if (element.type === "node") {
                    const latlng = [element.lat, element.lon];
                    L.marker(latlng).addTo(map)
                        .bindPopup(`<b>${element.tags.name || "Unnamed"}</b><br>Historic site`);
                }
                // You can also handle 'way' or 'relation' elements here if needed
            });
        })
        .catch(err => {
            console.error("Error fetching historical sights:", err);
            alert("Error occurred while fetching historical sights.");
        });
}

// Function to get suggestions from Nominatim as the user types
function getSuggestions(query) {
    const nominatimUrl = "https://nominatim.openstreetmap.org/search";
    const params = new URLSearchParams({
        q: query,
        format: "json",
        addressdetails: 1,
        limit: 5,  // Limit to 5 suggestions
        tag: "historic" // Ensure suggestions are only for historic places
    });

    fetch(`${nominatimUrl}?${params}`)
        .then(response => response.json())
        .then(data => {
            const suggestions = data.map(place => place.display_name);
            showSuggestions(suggestions);
        })
        .catch(err => {
            console.error("Error fetching suggestions:", err);
        });
}

// Display the suggestions in the autocomplete dropdown
function showSuggestions(suggestions) {
    const suggestionBox = document.getElementById('suggestions');
    suggestionBox.innerHTML = ''; // Clear previous suggestions

    if (suggestions.length === 0) {
        suggestionBox.style.display = 'none'; // Hide if no suggestions
        return;
    }

    // Show suggestion list
    suggestionBox.style.display = 'block';

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        div.textContent = suggestion;
        div.onclick = function () {
            document.getElementById('search-input').value = suggestion;
            suggestionBox.style.display = 'none'; // Hide suggestions after selection
            searchLocation(suggestion); // Trigger the search for the selected suggestion
        };
        suggestionBox.appendChild(div);
    });
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        searchLocation(query);
    } else {
        alert("Please enter a location.");
    }
});

// Add an event listener for "Enter" key to trigger search
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        document.getElementById('search-btn').click();
    }
});

// Add event listener for input field to trigger suggestions on typing
document.getElementById('search-input').addEventListener('input', function () {
    const query = document.getElementById('search-input').value;
    if (query.length >= 3) { // Trigger suggestions after 3 characters
        getSuggestions(query);
    }
});

// Optional: Close suggestion box if user clicks outside
document.addEventListener('click', function (e) {
    const suggestionBox = document.getElementById('suggestions');
    if (!suggestionBox.contains(e.target) && e.target !== document.getElementById('search-input')) {
        suggestionBox.style.display = 'none';
    }
});
