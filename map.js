// map.js

// Initialize Leaflet map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Local state for selected site
let selectedCountry = null;
let selectedSiteName = null;

/**
 * Step 1: Populate the country <select> from data.js
 * (which should define something like `window.countryCoordinates`)
 */
const countryDropdown = document.getElementById('country');
if (countryDropdown && window.countryCoordinates) {
    Object.keys(window.countryCoordinates).forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
    });
}

// Step 2: Set up the Search button
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
}

// Main search handler
async function handleSearch() {
    const country = countryDropdown?.value;
    const historicType = document.getElementById('historicType')?.value;

    if (!country || !historicType) {
        alert('Please select both country and historic type.');
        return;
    }

    try {
        // Fetch data from your server
        const url = `http://localhost:5000/api/historic-sites?country=${encodeURIComponent(country)}&historicType=${encodeURIComponent(historicType)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            alert(`No results found for ${historicType} in ${country}.`);
            return;
        }

        // Clear any existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Place markers
        data.forEach(site => {
            if (site.lat && site.lon) {
                // Build the popup HTML
                const popupContent = `
                    <strong>${site.name || 'Unnamed'}</strong><br>
                    English Name: ${site.name_en || 'N/A'}<br>
                    Type: ${site.historicType}<br>
                    <a href="https://www.openstreetmap.org/${site.type}/${site.id}" target="_blank">
                        View on OSM
                    </a><br><br>
                    <button id="selectNodeBtn-${site.id}" style="margin-top: 5px;">
                        Select this site
                    </button>
                `;

                // Create marker with popup
                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);

                /**
                 * Each time the popup opens, attach (or re-attach) the click listener
                 * to the "Select this site" button. We use { once: true } so that each
                 * time the popup is shown, the event will only fire once per open.
                 */
                marker.on('popupopen', e => {
                    // Get the popup's DOM element
                    const container = e.popup.getElement();
                    // Find the specific button for this site
                    const selectBtn = container?.querySelector(`#selectNodeBtn-${site.id}`);
                    if (selectBtn) {
                        selectBtn.addEventListener(
                            'click',
                            () => {
                                // Always make a new request to Wikipedia when clicked
                                handleSiteSelection(country, site.name);
                            },
                            { once: true } 
                        );
                    }
                });
            }
        });

        // Zoom to the first result
        const firstResult = data.find(site => site.lat && site.lon);
        if (firstResult) {
            map.setView([firstResult.lat, firstResult.lon], 10);
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        alert('Failed to fetch historic sites. Please try again later.');
    }
}

/**
 * Step 3: Handle the logic when "Select this site" is clicked
 */
function handleSiteSelection(country, siteName) {
    // Update local state
    selectedCountry = country;
    selectedSiteName = siteName || 'Unnamed';

    // Update the DOM safely (check if elements exist)
    const siteNameEl = document.getElementById('selectedSiteName');
    const countryEl = document.getElementById('selectedCountry');
    const infoEl = document.getElementById('selectedInfo');

    if (siteNameEl) {
        siteNameEl.textContent = `Site Name: ${selectedSiteName}`;
    }
    if (countryEl) {
        countryEl.textContent = `Country: ${selectedCountry}`;
    }
    if (infoEl) {
        // Clear old Wikipedia summary (if any)
        infoEl.querySelectorAll('.wiki-summary').forEach(el => el.remove());
    }

    // Make the Wikipedia request
    fetchWikipediaSummary(selectedSiteName, selectedCountry);
}

/**
 * Step 4: Wikipedia summary fetch
 */
async function fetchWikipediaSummary(siteName, country) {
    const infoEl = document.getElementById('selectedInfo');
    if (!infoEl) return;

    // Provide a quick "loading" message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'wiki-summary';
    loadingMsg.innerHTML = `<h3>Loading Wikipedia summary...</h3>`;
    infoEl.appendChild(loadingMsg);

    // 1) Attempt: "SiteName (Country)"
    let title = `${siteName} (${country})`;
    let data = await fetchWikiData(title);

    // If that fails or is empty, fallback to just "SiteName"
    if (!data || !data.extract) {
        title = siteName;
        data = await fetchWikiData(title);
    }

    // Remove loading message
    loadingMsg.remove();

    // Build the final summary or error message
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'wiki-summary';
    
    if (data && data.extract) {
        summaryDiv.innerHTML = `
            <h3>Wikipedia Summary for "${title}"</h3>
            <p>${data.extract}</p>
            <a href="${data.content_urls ? data.content_urls.desktop.page : '#'}" target="_blank">
                Read more on Wikipedia
            </a>
        `;
    } else {
        summaryDiv.innerHTML = `
            <h3>Wikipedia Summary</h3>
            <p>No Wikipedia summary available for this site.</p>
        `;
    }
    infoEl.appendChild(summaryDiv);
}

/**
 * Helper: fetch from Wikipedia's REST API
 */
async function fetchWikiData(title) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching from Wikipedia:', error);
        return null;
    }
}
