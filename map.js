// Map setup
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markersLayer = L.layerGroup().addTo(map); // Layer to hold markers

// Populate the country dropdown
fetch('/api/countries')
    .then(response => response.json())
    .then(countries => {
        const countrySelect = document.getElementById('country');
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching countries:', error));

// Fetch and display historic sites based on user selection
document.getElementById('searchBtn').addEventListener('click', () => {
    const country = document.getElementById('country').value;
    const historicType = document.getElementById('historicType').value;

    if (!country || !historicType) {
        alert('Please select both a country and a historic type.');
        return;
    }

    fetch(`/api/historic-sites?country=${country}&historicType=${historicType}`)
        .then(response => response.json())
        .then(data => {
            markersLayer.clearLayers(); // Clear previous markers
            data.forEach(site => {
                const marker = L.marker([site.lat, site.lon])
                    .addTo(markersLayer)
                    .bindPopup(`<strong>${site.name}</strong><br>Type: ${site.historicType}`)
                    .on('click', () => {
                        displayNodeDetails(site.id, site.name, site.historicType);
                    });
            });
        })
        .catch(error => console.error('Error fetching historic sites:', error));
});

// Display node details and fetch Wikipedia summary
function displayNodeDetails(nodeId, nodeName, historicType) {
    const detailsElement = document.getElementById('nodeDetails');
    detailsElement.innerHTML = `
        <strong>Name:</strong> ${nodeName}<br>
        <strong>Type:</strong> ${historicType}<br>
        <em>Loading Wikipedia summary...</em>
    `;

    fetch(`/wiki-summary?name=${encodeURIComponent(nodeName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.summary) {
                detailsElement.innerHTML += `<p><strong>Summary:</strong> ${data.summary}</p>`;
            } else {
                detailsElement.innerHTML += `<p><em>No summary available on Wikipedia.</em></p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching Wikipedia summary:', error);
            detailsElement.innerHTML += `<p><em>Error fetching Wikipedia summary.</em></p>`;
        });
}
