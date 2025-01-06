// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13); // Initial view at lat: 51.505, lon: -0.09 (London)

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
