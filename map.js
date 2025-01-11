// Initialize map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

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

    if (!country || !historicType) {
        alert('Please select both country and historic type.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/historic-sites?country=${encodeURIComponent(country)}&historicType=${encodeURIComponent(historicType)}`);
        const data = await response.json();

        if (data.length === 0) {
            alert(`No results found for ${historicType} in ${country}.`);
            return;
        }

        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });

        // Add markers and attach click events
        data.forEach(site => {
            if (site.lat && site.lon) {
                const popupContent = `
                    <strong>${site.name || 'Unnamed'}</strong><br>
                    Type: ${site.historicType}<br>
                    <a href="https://www.openstreetmap.org/${site.type}/${site.id}" target="_blank">View on OSM</a>
                `;
                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);

                marker.on('click', async () => {
                    const selectedNodeDetails = {
                        name: site.name || 'Unnamed',
                        country,
                    };

                    // Update right panel
                    document.getElementById('nodeDetails').innerHTML = `
                        <strong>Selected Node:</strong><br>
                        Name: ${selectedNodeDetails.name}<br>
                        Country: ${selectedNodeDetails.country}
                    `;

                    // Send to backend
                    try {
                        await fetch('http://localhost:5000/api/selected-node', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(selectedNodeDetails),
                        });
                    } catch (error) {
                        console.error('Error sending selected node details:', error);
                    }
                });
            }
        });

        // Zoom to the first result
        const firstResult = data.find(site => site.lat && site.lon);
        if (firstResult) map.setView([firstResult.lat, firstResult.lon], 10);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch historic sites.');
    }
});
