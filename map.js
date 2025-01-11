// map.js

// Initialize map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Store selected node info locally
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

// Event listener for "Search" button
document.getElementById('searchBtn').addEventListener('click', async () => {
    const country = countryDropdown.value;
    const historicType = document.getElementById('historicType').value;

    if (!country || !historicType) {
        alert('Please select both country and historic type.');
        return;
    }

    try {
        // Fetch data from the backend
        const response = await fetch(
            `http://localhost:5000/api/historic-sites?country=${encodeURIComponent(country)}&historicType=${encodeURIComponent(historicType)}`
        );
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.length === 0) {
            alert(`No results found for ${historicType} in ${country}.`);
            return;
        }

        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for each site
        data.forEach(site => {
            if (site.lat && site.lon) {
                const popupContent = `
                    <strong>${site.name || 'Unnamed'}</strong><br>
                    English Name: ${site.name_en || 'N/A'}<br>
                    Type: ${site.historicType}<br>
                    <a href="https://www.openstreetmap.org/${site.type}/${site.id}" target="_blank">View on OSM</a><br>
                    <button id="selectNodeBtn-${site.id}" style="margin-top: 5px;">
                        Select this site
                    </button>
                `;

                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);

                // Attach event listener to each "Select this site" button
                marker.on('popupopen', () => {
                    const selectBtn = document.getElementById(`selectNodeBtn-${site.id}`);
                    if (selectBtn) {
                        selectBtn.addEventListener('click', () => {
                            // Always call the Wikipedia API here

                            // Update local variables
                            selectedCountry = country;
                            selectedSiteName = site.name || 'Unnamed';

                            // Update DOM safely
                            const siteNameEl = document.getElementById('selectedSiteName');
                            const countryEl = document.getElementById('selectedCountry');

                            if (siteNameEl) {
                                siteNameEl.textContent = `Site Name: ${selectedSiteName}`;
                            }
                            if (countryEl) {
                                countryEl.textContent = `Country: ${selectedCountry}`;
                            }

                            // Clear old summary
                            const infoEl = document.getElementById('selectedInfo');
                            if (infoEl) {
                                infoEl.innerHTML = ''; 
                            }

                            // Call Wikipedia API
                            fetchWikipediaSummary(selectedSiteName, selectedCountry);
                        });
                    }
                });
            }
        });

        // Zoom to the first result
        const firstResult = data.find(site => site.lat && site.lon);
        if (firstResult) {
            map.setView([firstResult.lat, firstResult.lon], 10);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch historic sites. Please try again later.');
    }
});

// Fetch Wikipedia summary
async function fetchWikipediaSummary(siteName, country) {
    // Show a temporary loading message
    const infoEl = document.getElementById('selectedInfo');
    if (infoEl) {
        infoEl.innerHTML = `<h3>Loading Wikipedia summary...</h3>`;
    }

    // First try: "SiteName (Country)"
    const title = `${siteName} (${country})`;
    try {
        let data = await fetchWikiData(title);
        if (data && data.extract) {
            updateInfo(data, `Wikipedia Summary for "${title}"`);
        } else {
            // Fallback: just "SiteName"
            data = await fetchWikiData(siteName);
            if (data && data.extract) {
                updateInfo(data, `Wikipedia Summary (Fallback) for "${siteName}"`);
            } else {
                if (infoEl) {
                    infoEl.innerHTML = `
                        <h3>Wikipedia Summary</h3>
                        <p>No Wikipedia summary available for this site.</p>
                    `;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching Wikipedia summary:', error);
        if (infoEl) {
            infoEl.innerHTML = `
                <h3>Wikipedia Summary</h3>
                <p>Failed to fetch Wikipedia summary. Please try again later.</p>
            `;
        }
    }
}

// Helper function to fetch from Wikipedia's REST API
async function fetchWikiData(title) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );
        if (!response.ok) {
            return null; // or throw an Error if you prefer
        }
        return await response.json();
    } catch (err) {
        return null;
    }
}

// Helper to update #selectedInfo
function updateInfo(data, heading) {
    const infoEl = document.getElementById('selectedInfo');
    if (infoEl) {
        infoEl.innerHTML = `
            <h3>${heading}</h3>
            <p>${data.extract}</p>
            <a href="${data.content_urls ? data.content_urls.desktop.page : '#'}" target="_blank">
                Read more on Wikipedia
            </a>
        `;
    }
}
