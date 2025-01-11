// map.js

/**
 * Previously data.js content (countryCoordinates)
 * Now included directly here so we don't need a separate file.
 */
const countryCoordinates = {
    "Afghanistan": "29.3, 60.9, 38.5, 77.1",
    "Albania": "39.6, 19.3, 42.6, 21.1",
    "Algeria": "19.0, -8.0, 37.1, 11.0",
    "Andorra": "42.4, 1.4, 42.7, 1.8",
    "Angola": "-18.0, 11.0, -4.0, 24.0",
    "Antigua and Barbuda": "17.2, -62.5, 17.7, -61.8",
    "Argentina": "-55.1, -73.4, -21.8, -53.7",
    "Armenia": "38.8, 40.1, 41.3, 47.0",
    "Australia": "-43.6, 112.0, -10.0, 153.6",
    "Austria": "47.0, 9.5, 49.0, 17.0",
    "Azerbaijan": "38.0, 44.0, 41.0, 51.0",
    "Bahrain": "25.5, 50.2, 26.3, 50.7",
    "Bangladesh": "20.7, 88.0, 26.7, 92.5",
    "Barbados": "13.1, -59.3, 13.5, -59.0",
    "Belarus": "53.0, 23.0, 56.0, 32.0",
    "Belgium": "49.5, 2.5, 51.5, 6.5",
    "Belize": "15.8, -89.2, 18.0, -87.7",
    "Benin": "6.2, 2.3, 12.5, 3.9",
    "Bhutan": "26.5, 88.5, 28.3, 92.5",
    "Bolivia": "-22.9, -69.4, -9.6, -57.4",
    "Bosnia and Herzegovina": "42.0, 15.7, 44.3, 19.6",
    "Botswana": "-26.4, 20.0, -17.8, 30.0",
    "Brazil": "-33.7, -74.1, 5.3, -34.9",
    "Brunei": "4.5, 114.0, 5.0, 115.0",
    "Burkina Faso": "9.4, -5.5, 15.0, 2.0",
    "Burundi": "-4.4, 29.5, -2.0, 30.9",
    "Cabo Verde": "14.7, -25.0, 16.3, -22.5",
    "Cambodia": "10.5, 102.5, 14.5, 107.5",
    "Cameroon": "1.5, 9.7, 13.5, 16.1",
    "Canada": "41.7, -141.0, 83.1, -52.6",
    "Central African Republic": "2.2, 14.5, 11.1, 27.5",
    "Chad": "7.4, 12.0, 23.4, 20.0",
    "Chile": "-56.0, -75.5, -17.5, -66.0",
    "China": "18.0, 73.5, 53.5, 135.0",
    "Colombia": "12.5, -79.0, 4.2, -66.0",
    "Comoros": "-12.0, 43.0, -11.5, 44.5",
    "Costa Rica": "8.1, -85.0, 11.2, -82.5",
    "Croatia": "42.5, 13.0, 45.3, 19.5",
    "Cuba": "19.8, -85.0, 23.1, -74.0",
    "Cyprus": "34.5, 32.0, 35.5, 34.5",
    "Czech Republic (Czechia)": "49.5, 12.0, 51.5, 19.0",
    "Democratic Republic of the Congo": "-5.0, 12.0, 5.5, 18.5",
    "Denmark": "54.0, 8.0, 57.8, 15.0",
    "Dominica": "15.2, -61.2, 15.6, -60.5",
    "Dominican Republic": "17.6, -71.7, 19.9, -68.3",
    "Djibouti": "10.9, 41.5, 12.8, 43.0",
    "Egypt": "22.0, 25.0, 31.0, 34.0",
    "El Salvador": "12.9, -90.2, 13.7, -87.7",
    "Equatorial Guinea": "1.5, 5.5, 3.5, 11.0",
    "Eritrea": "12.5, 41.0, 18.0, 43.0",
    "Estonia": "57.0, 21.5, 59.5, 28.2",
    "Eswatini (fmr. Swaziland)": "-27.5, 31.0, -25.5, 32.5",
    "Ethiopia": "3.5, 33.0, 15.0, 48.0",
    "Fiji": "-20.4, 175.0, -16.5, 178.0",
    "Finland": "60.0, 20.0, 70.0, 32.0",
    "France": "41.3, -5.1, 51.1, 9.5",
    "Gabon": "-3.9, 9.5, 3.0, 15.5",
    "Gambia": "13.1, -16.8, 13.5, -13.5",
    "Georgia": "41.0, 40.0, 43.6, 46.7",
    "Germany": "47.3, 5.8, 55.1, 15.0",
    "Ghana": "4.5, -3.0, 11.5, 1.5",
    "Guatemala": "13.0, -92.2, 15.1, -88.2",
    "Guinea": "7.0, -15.5, 12.7, -7.0",
    "Guinea-Bissau": "10.0, -15.0, 12.5, -13.5",
    "Haiti": "18.0, -74.2, 19.7, -71.7",
    "Honduras": "13.0, -89.3, 15.5, -83.2",
    "Hungary": "45.8, 16.0, 48.0, 22.5",
    "Iceland": "63.5, -23.5, 66.5, -13.0",
    "India": "6.5, 68.0, 35.0, 97.4",
    "Indonesia": "-11.0, 95.0, 6.5, 141.0",
    "Iran": "24.5, 44.0, 39.8, 63.5",
    "Iraq": "29.0, 38.0, 37.5, 48.5",
    "Ireland": "51.0, -10.5, 55.5, -5.0",
    "Israel": "29.5, 34.3, 33.3, 35.5",
    "Italy": "36.6, 6.5, 47.1, 18.5",
    "Jamaica": "17.7, -78.0, 18.5, -76.0",
    "Japan": "24.2, 122.9, 45.6, 153.9",
    "Jordan": "29.2, 35.0, 33.4, 39.0",
    "Kazakhstan": "40.0, 46.0, 55.0, 87.5",
    "Kenya": "-4.5, 34.5, 5.0, 42.0",
    "Kiribati": "-0.1, 169.0, 4.5, 174.0",
    "Kosovo": "41.8, 20.2, 42.6, 21.9",
    "Kuwait": "28.5, 46.0, 30.0, 48.5",
    "Kyrgyzstan": "41.0, 69.0, 43.0, 80.0",
    "Laos": "14.0, 100.0, 21.0, 107.5",
    "Latvia": "55.5, 20.0, 58.0, 28.0",
    "Lebanon": "33.0, 35.0, 34.6, 36.6",
    "Lesotho": "-30.5, 27.5, -28.0, 30.0",
    "Liberia": "4.3, -9.5, 9.4, -7.0",
    "Libya": "18.0, 9.0, 33.0, 25.5",
    "Liechtenstein": "47.1, 9.4, 47.3, 9.6",
    "Lithuania": "54.9, 20.8, 56.4, 26.5",
    "Luxembourg": "49.5, 5.9, 50.1, 6.5",
    "Madagascar": "-25.0, 43.0, -12.0, 50.5",
    "Malawi": "-14.0, 34.0, -9.0, 36.5",
    "Malaysia": "1.3, 100.0, 7.4, 119.5",
    "Maldives": "3.5, 72.5, 7.0, 74.5",
    "Mali": "10.0, -12.5, 25.0, -3.0",
    "Malta": "35.8, 14.2, 36.2, 14.8",
    "Marshall Islands": "4.0, 167.0, 14.0, 173.0",
    "Mauritania": "14.5, -17.0, 27.0, -4.5",
    "Mauritius": "-20.3, 57.3, -19.9, 63.6",
    "Mexico": "14.5, -118.5, 32.7, -86.7",
    "Micronesia": "1.4, 150.2, 9.3, 162.3",
    "Moldova": "45.0, 26.5, 49.5, 30.0",
    "Monaco": "43.7, 7.4, 43.8, 7.5",
    "Mongolia": "41.6, 87.5, 52.0, 119.0",
    "Montenegro": "41.9, 18.5, 43.7, 20.4",
    "Morocco": "27.7, -13.0, 36.6, -0.0",
    "Mozambique": "-26.0, 30.0, -10.0, 40.0",
    "Myanmar (Burma)": "9.5, 92.0, 28.5, 101.0",
    "Namibia": "-29.0, 11.5, -17.0, 25.0",
    "Nauru": "-0.6, 166.9, -0.5, 167.3",
    "Nepal": "26.3, 80.0, 30.4, 88.2",
    "Netherlands": "50.7, 3.3, 53.5, 7.5",
    "New Zealand": "-47.5, 166.0, -34.0, 179.0",
    "Nicaragua": "11.9, -87.7, 14.0, -82.0",
    "Niger": "11.0, 0.5, 23.5, 15.0",
    "Nigeria": "4.0, 3.0, 13.0, 14.5",
    "North Korea": "37.5, 124.0, 41.7, 131.0",
    "North Macedonia": "41.5, 20.5, 42.5, 22.0",
    "Norway": "58.0, 5.5, 71.2, 31.0",
    "Oman": "16.5, 53.0, 26.0, 59.0",
    "Pakistan": "23.6, 60.9, 37.0, 77.4",
    "Palau": "7.0, 134.5, 8.0, 134.9",
    "Panama": "7.0, -77.2, 9.5, -77.0",
    "Papua New Guinea": "-11.0, 141.0, -4.0, 156.0",
    "Paraguay": "-27.0, -62.0, -19.3, -54.0",
    "Peru": "-18.0, -81.0, -0.1, -68.5",
    "Philippines": "4.0, 116.0, 21.0, 127.0",
    "Poland": "49.0, 14.1, 54.9, 24.1",
    "Portugal": "36.0, -9.5, 42.0, -6.0",
    "Qatar": "24.5, 50.5, 26.0, 51.5",
    "Romania": "43.6, 20.2, 48.2, 30.7",
    "Russia": "41.2, 19.1, 81.9, 169.5",
    "Rwanda": "-2.5, 28.9, -1.0, 30.9",
    "Saint Kitts and Nevis": "17.1, -62.7, 17.4, -62.5",
    "Saint Lucia": "13.8, -61.2, 14.1, -60.9",
    "Saint Vincent and the Grenadines": "12.5, -61.5, 13.3, -61.0",
    "Samoa": "-14.2, -172.3, -13.2, -171.5",
    "San Marino": "43.9, 12.4, 44.0, 12.6",
    "Sao Tome and Principe": "0.0, 6.3, 1.0, 7.4",
    "Saudi Arabia": "16.0, 34.0, 32.0, 56.0",
    "Senegal": "12.0, -17.5, 16.5, -11.5",
    "Serbia": "43.0, 18.6, 46.0, 23.0",
    "Seychelles": "-5.5, 46.0, -4.5, 47.5",
    "Sierra Leone": "7.5, -13.0, 9.5, -10.0",
    "Singapore": "1.2, 103.6, 1.5, 104.1",
    "Slovakia": "48.5, 16.8, 49.7, 22.5",
    "Slovenia": "45.5, 13.3, 46.7, 16.6",
    "Solomon Islands": "-11.5, 155.0, -6.0, 159.0",
    "Somalia": "1.0, 41.0, 11.5, 51.5",
    "South Africa": "-34.8, 17.0, -22.0, 32.9",
    "South Korea": "33.1, 126.4, 38.6, 130.9",
    "South Sudan": "3.5, 28.0, 13.5, 35.0",
    "Spain": "27.5, -18.1, 43.5, 4.5",
    "Sri Lanka": "5.9, 79.9, 9.8, 81.3",
    "Sudan": "8.0, 21.5, 22.0, 38.0",
    "Suriname": "3.7, -58.5, 6.0, -53.0",
    "Sweden": "55.0, 11.0, 69.0, 24.0",
    "Switzerland": "45.8, 5.9, 47.8, 10.5",
    "Syria": "32.0, 35.0, 37.5, 42.0",
    "Taiwan": "20.8, 119.3, 25.5, 122.0",
    "Tajikistan": "36.0, 67.0, 41.0, 75.0",
    "Tanzania": "-11.5, 29.0, -1.0, 41.0",
    "Thailand": "5.5, 97.0, 20.0, 106.0",
    "Togo": "6.0, -0.5, 11.5, 1.5",
    "Tonga": "-21.5, -179.0, -15.5, -172.5",
    "Trinidad and Tobago": "10.0, -61.5, 11.3, -60.5",
    "Tunisia": "32.0, 7.5, 37.5, 11.0",
    "Turkey": "36.0, 26.0, 42.0, 45.0",
    "Turkmenistan": "35.0, 52.0, 42.0, 66.0",
    "Tuvalu": "-7.5, 177.0, -5.0, 179.0",
    "Uganda": "-1.5, 29.5, 4.5, 35.0",
    "Ukraine": "44.0, 22.0, 53.0, 40.0",
    "United Arab Emirates": "22.6, 51.6, 26.1, 56.0",
    "United Kingdom": "49.9, -8.6, 61.1, 1.9",
    "United States": "24.5, -125.0, 49.5, -66.9",
    "Uruguay": "-35.0, -58.0, -30.1, -53.0",
    "Uzbekistan": "40.0, 56.0, 46.0, 74.0",
    "Vanuatu": "-20.0, 166.5, -13.0, 170.5",
    "Vatican City": "41.9, 12.4, 41.9, 12.5",
    "Venezuela": "0.6, -73.0, 12.0, -59.5",
    "Vietnam": "8.0, 102.1, 23.4, 109.5",
    "Yemen": "12.0, 43.0, 19.0, 54.0",
    "Zambia": "-18.0, 22.0, -8.0, 33.0",
    "Zimbabwe": "-17.9, 25.0, -15.0, 32.0"
};

// -----------------------------------------------
// Below is your original "map.js" logic
// -----------------------------------------------

// Initialize Leaflet map
const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Local state for selected site
let selectedCountry = null;
let selectedSiteName = null;

/**
 * Step 1: Populate the country <select> from the countryCoordinates above
 */
const countryDropdown = document.getElementById('country');
if (countryDropdown && countryCoordinates) {
    Object.keys(countryCoordinates).forEach(country => {
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
