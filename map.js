// Initialize map
const map = L.map('map').setView([20, 0], 2);  // Default to global view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Variable to hold the currently selected node
let selectedNode = null;

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
                const marker = L.marker([site.lat, site.lon]).addTo(map).bindPopup(popupContent);

                // Attach click event to set the selected marker
                marker.on('click', () => {
                    selectedNode = site;
                    document.getElementById('nodeDetails').textContent = `Selected: ${site.name || 'Unnamed'}`;
                    document.getElementById('factsheetBtn').style.display = 'block';  // Show the button to generate factsheet
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

// Event listener for the factsheet button
document.getElementById('factsheetBtn').addEventListener('click', async () => {
    if (!selectedNode) {
        alert('Please select a marker first!');
        return;
    }

    const { name, lat, lon } = selectedNode;

    // Example API call to Wikipedia or another source for the factsheet info
    const factsheet = await generateFactsheet(name, lat, lon);

    // Display factsheet in the right panel
    const factsheetDiv = document.getElementById('nodeDetails');
    factsheetDiv.innerHTML = `
        <h4>Factsheet for ${name || 'Unnamed'}</h4>
        <p><strong>Location:</strong> Latitude: ${lat}, Longitude: ${lon}</p>
        <p><strong>Historical Significance:</strong> ${factsheet.significance}</p>
        <p><strong>Notable Events:</strong> ${factsheet.events}</p>
        <p><strong>Cultural Context:</strong> ${factsheet.culturalContext}</p>
    `;
});

// Function to generate factsheet using AI (e.g., GPT-3 or GPT-4)
async function generateFactsheet(name, lat, lon) {
    const prompt = `Provide a detailed historical factsheet for a location named "${name}", with coordinates Latitude: ${lat}, Longitude: ${lon}. Include the historical significance, notable events, and cultural context.`;

    // Call AI (OpenAI) API (Note: you'll need an actual API key)
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // Replace with your OpenAI API key
        },
        body: JSON.stringify({
            model: 'text-davinci-003', // or any other model like GPT-4
            prompt: prompt,
            max_tokens: 500
        })
    });

    const data = await response.json();
    return {
        significance: data.choices[0].text.split('\n')[0],  // Example of extracting information
        events: data.choices[0].text.split('\n')[1],  // Extract notable events
        culturalContext: data.choices[0].text.split('\n')[2]  // Cultural context
    };
}
