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
                L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);
            }
        });

        // Zoom to first result
        const firstResult = data.find(site => site.lat && site.lon);
        if (firstResult) {
            map.setView([firstResult.lat, firstResult.lon], 10);

            // Fetch and display selected site's details
            fetchSiteDetails(firstResult.id, firstResult.country);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch historic sites. Please try again later.');
    }
});

// Function to fetch and display site details including Wikipedia summary
async function fetchSiteDetails(siteId, country) {
    try {
        const response = await fetch(`http://localhost:5000/api/selected-node?id=${siteId}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const selectedInfo = await response.json();

        // Update the selected site panel
        document.getElementById('selectedSiteName').textContent = `Site Name: ${selectedInfo.name}`;
        document.getElementById('selectedCountry').textContent = `Country: ${country}`;

        // Display Wikipedia summary if available
        document.getElementById('selectedInfoSummary').textContent = selectedInfo.summary || 'No Wikipedia summary available.';

    } catch (error) {
        console.error('Error fetching site details:', error);
        alert('Failed to fetch site details.');
    }
}
