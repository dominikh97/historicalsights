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

// Function to fetch Wikipedia summary
async function fetchWikipediaSummary(siteName, country) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(siteName)}`);
        if (!response.ok) {
            throw new Error('Error fetching Wikipedia summary');
        }
        const data = await response.json();
        return data.extract;  // Return the summary
    } catch (error) {
        console.error(`Error fetching Wikipedia summary for ${siteName}:`, error);
        return null;
    }
}

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
        data.forEach(async site => {
            if (site.lat && site.lon) {
                const popupContent = `
                    <strong>${site.name || 'Unnamed'}</strong><br>
                    English Name: ${site.name_en || 'N/A'}<br>
                    Type: ${site.historicType}<br>
                    <a href="https://www.openstreetmap.org/${site.type}/${site.id}" target="_blank">View on OSM</a>
                    <button id="selectBtn-${site.id}" class="selectBtn" data-site-id="${site.id}" data-site-name="${site.name}" data-site-country="${country}">Select this site</button>
                `;
                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);

                // Add click event for selecting a site
                marker.on('click', async () => {
                    const selectedSiteId = marker.options.id;
                    const selectedSiteName = site.name;
                    const selectedCountry = country;

                    // Fetch the Wikipedia summary for the selected site
                    const summary = await fetchWikipediaSummary(selectedSiteName, selectedCountry);
                    displaySelectedInfo(selectedSiteName, selectedCountry, summary);
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

// Function to display selected site info
function displaySelectedInfo(name, country, summary) {
    document.getElementById('selectedSiteName').textContent = `Site Name: ${name || 'N/A'}`;
    document.getElementById('selectedCountry').textContent = `Country: ${country || 'N/A'}`;
    if (summary) {
        document.getElementById('selectedInfoSummary').textContent = summary;
    } else {
        document.getElementById('selectedInfoSummary').textContent = 'Summary not available.';
    }
}
