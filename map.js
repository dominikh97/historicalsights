// Initialize map
const map = L.map('map').setView([20, 0], 2);  // Default to global view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Populate country dropdown from data.js (loaded from 'data.js' script)
const countryDropdown = document.getElementById('country');
Object.keys(countryCoordinates).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
});

// Set up the right panel button
const polygonBtn = document.getElementById('polygonBtn');
const nodeDetails = document.getElementById('nodeDetails');

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

                // Add event listener for each marker
                marker.on('click', () => {
                    // Display node details and show polygon button
                    nodeDetails.textContent = `Name: ${site.name || 'Unnamed'}\nType: ${site.historicType}`;
                    polygonBtn.style.display = 'block'; // Show polygon button
                    polygonBtn.onclick = () => drawPolygon(site); // Set click handler to fetch polygon
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

// This is where the polygon drawing logic will happen
function drawPolygon(site) {
    // Call the drawPolygon function from drawPolygon.js to calculate and display the polygon
    console.log('Fetching polygon for:', site.name);
    // Assuming drawPolygon function is defined in drawPolygon.js and will take care of fetching the polygon data
    // For example, this could be a function that fetches data from the wiki-text or other source
    // The polygon is then drawn based on the retrieved data
}
