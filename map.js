// Initialize map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Variable to hold the selected location string
let selectedLocation = '';

// Populate country dropdown
const countryDropdown = document.getElementById('country');
Object.keys(countryCoordinates).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
});

// Search button event listener
document.getElementById('searchBtn').addEventListener('click', async () => {
    const country = countryDropdown.value;
    const historicType = document.getElementById('historicType').value;
    const searchTerm = document.getElementById('searchTerm').value.trim();

    if (!country || !historicType) {
        alert('Please select both country and historic type.');
        return;
    }

    selectedLocation = `${searchTerm} ${country}`.trim();
    localStorage.setItem('selectedLocation', selectedLocation);

    // Save location to the backend
    try {
        await fetch('http://localhost:5000/api/save-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: selectedLocation }),
        });
        console.log('Location saved to backend.');
    } catch (error) {
        console.error('Error saving location:', error);
    }

    // Fetch and display results on the map
    try {
        const response = await fetch(`http://localhost:5000/api/historic-sites?country=${encodeURIComponent(country)}&historicType=${encodeURIComponent(historicType)}&q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        
        const data = await response.json();
        if (data.length === 0) {
            alert(`No results found for ${searchTerm} in ${country}.`);
            return;
        }

        // Add markers to the map
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });
        data.forEach(site => {
            if (site.lat && site.lon) {
                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(`<strong>${site.name || 'Unnamed'}</strong>`);
            }
        });

        if (data[0]) map.setView([data[0].lat, data[0].lon], 10);
    } catch (error) {
        console.error('Error fetching historic sites:', error);
        alert('Failed to fetch historic sites.');
    }
});
