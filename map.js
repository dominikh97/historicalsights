// map.js
const L = require('leaflet'); // Ensure Leaflet is installed

// Create a map centered on a default location
const map = L.map('map').setView([51.505, -0.09], 13); // Example: Center at coordinates [51.505, -0.09]

// Set up the OpenStreetMap tile layer for the background map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Function to fetch historic sites data
async function fetchHistoricSites(country, historicType, searchTerm) {
  try {
    const response = await fetch(`/api/historic-sites?country=${country}&historicType=${historicType}&q=${searchTerm || ''}`);
    if (!response.ok) {
      throw new Error('Failed to fetch historic sites data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to display historic sites on the map
function displayHistoricSites(historicSites) {
  historicSites.forEach(site => {
    const { lat, lon, name, name_en } = site;
    const popupContent = `
      <h3>${name}</h3>
      <p>English Name: ${name_en}</p>
      <p>Historic Type: ${site.historicType}</p>
    `;

    // Create a marker for each historic site
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(popupContent);
  });
}

// Example usage: Fetch and display historic sites for a specific country and type
// Call the fetch function and pass in parameters like 'Germany' and 'castle'
async function loadAndDisplaySites() {
  const country = 'Germany';  // Example country
  const historicType = 'castle';  // Example type
  const searchTerm = '';  // Optional search term

  const sites = await fetchHistoricSites(country, historicType, searchTerm);
  if (sites) {
    displayHistoricSites(sites);
  }
}

// Call the function to load and display sites
loadAndDisplaySites();
