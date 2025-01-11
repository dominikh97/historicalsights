// Initialize map (unchanged)
const map = L.map('map').setView([20, 0], 2);  // Default to global view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Store selected node country and name locally (client-side state)
let selectedCountry = null;
let selectedSiteName = null;

// Populate country dropdown (unchanged)
const countryDropdown = document.getElementById('country');
Object.keys(countryCoordinates).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countryDropdown.appendChild(option);
});

// Event listener for search button (unchanged)
document.getElementById('searchBtn').addEventListener('click', async () => {
    const country = countryDropdown.value;
    const historicType = document.getElementById('historicType').value;

    if (!country || !historicType) {
        alert('Please select both country and historic type.');
        return;
    }

    try {
        // Fetch data from the backend API (unchanged)
        const response = await fetch(http://localhost:5000/api/historic-sites?country=${encodeURIComponent(country)}&historicType=${encodeURIComponent(historicType)});
        if (!response.ok) {
            throw new Error(Error: ${response.statusText});
        }

        const data = await response.json();
        if (data.length === 0) {
            alert(No results found for ${historicType} in ${country}.);
            return;
        }

        // Clear existing markers from map (unchanged)
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for each result (unchanged)
        data.forEach(site => {
            if (site.lat && site.lon) {
                const popupContent = 
                    <strong>${site.name || 'Unnamed'}</strong><br>
                    English Name: ${site.name_en || 'N/A'}<br>
                    Type: ${site.historicType}<br>
                    <a href="https://www.openstreetmap.org/${site.type}/${site.id}" target="_blank">View on OSM</a>
                    <button id="selectNodeBtn-${site.id}" style="margin-top: 5px;">Select this site</button>
                ;

                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);

                // Add event listener for the "Select this site" button
                marker.on('popupopen', () => {
                    document.getElementById(selectNodeBtn-${site.id}).addEventListener('click', () => {
                        // Store the selected country and site name in local variables
                        selectedCountry = country;  // Store country from dropdown
                        selectedSiteName = site.name || 'Unnamed';  // Store name of the selected site

                        // Update the selected information panel
                        document.getElementById('selectedSiteName').textContent = Site Name: ${selectedSiteName};
                        document.getElementById('selectedCountry').textContent = Country: ${selectedCountry};

                        // Fetch the Wikipedia summary for the selected site
                        fetchWikipediaSummary(selectedSiteName, selectedCountry);
                    });
                });
            }
        });

        // Zoom to first result (unchanged)
        const firstResult = data.find(site => site.lat && site.lon);
        if (firstResult) {
            map.setView([firstResult.lat, firstResult.lon], 10);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch historic sites. Please try again later.');
    }
});

// Fetch Wikipedia summary for the selected site
async function fetchWikipediaSummary(siteName, country) {
    // Create a Wikipedia page title based on the selected site name and country
    const title = ${siteName} (${country});  // Example: "Kështjella në Rrasen e Koshares (Albania)"

    try {
        // Make a request to the Wikipedia API to get the summary
        const response = await fetch(https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)});
        const data = await response.json();

        if (data && data.extract) {
            // Display the summary in the selected info panel
            document.getElementById('selectedInfo').innerHTML += 
                <h3>Wikipedia Summary</h3>
                <p>${data.extract}</p>
                <a href="${data.content_urls ? data.content_urls.desktop.page : '#'}" target="_blank">Read more on Wikipedia</a>
            ;
        } else {
            document.getElementById('selectedInfo').innerHTML += 
                <h3>Wikipedia Summary</h3>
                <p>No Wikipedia summary available for this site.</p>
            ;
        }
    } catch (error) {
        console.error('Error fetching Wikipedia summary:', error);
        document.getElementById('selectedInfo').innerHTML += 
            <h3>Wikipedia Summary</h3>
            <p>Failed to fetch Wikipedia summary. Please try again later.</p>
        ;
    }
}
