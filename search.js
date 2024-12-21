// Function to search for a location and update the map view
function searchLocation(query) {
    // Nominatim API URL for geocoding (location search)
    const nominatimUrl = "https://nominatim.openstreetmap.org/search";
    
    // Fetch location data from Nominatim
    const params = new URLSearchParams({
        q: query, // User's search query
        format: "json",
        addressdetails: 1,
        limit: 1 // Get only the top result
    });

    fetch(`${nominatimUrl}?${params}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Location not found. Please refine your search.");
                return;
            }

            const location = data[0];
            const lat = location.lat;
            const lon = location.lon;

            // Center the map on the found location and zoom in
            map.setView([lat, lon], 13);

            // Optionally add a marker to the found location
            L.marker([lat, lon]).addTo(map)
                .bindPopup(`Location: ${location.display_name}`)
                .openPopup();
        })
        .catch(err => {
            console.error("Error fetching location:", err);
            alert("Error occurred while searching for the location.");
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

// Optional: Add an event listener for "Enter" key to trigger search
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        document.getElementById('search-btn').click();
    }
});
