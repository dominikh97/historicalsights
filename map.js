// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to handle node selection
function onNodeSelected(node) {
    const nodeName = node.name || "Unknown";

    // Update node details in the right panel
    document.getElementById("nodeDetails").innerText = `Selected Node: ${nodeName}`;

    // Fetch Wikipedia description for the selected node
    fetch(`http://localhost:8000/fetch-description?nodeName=${encodeURIComponent(nodeName)}`)
        .then(response => response.json())
        .then(data => {
            const description = data.description || "No description available.";
            document.getElementById("wikiDescription").innerText = description;
        })
        .catch(error => {
            console.error('Error fetching Wikipedia description:', error);
            document.getElementById("wikiDescription").innerText = "Failed to fetch description.";
        });
}

// Example of adding a marker and attaching the click event
function addNodeMarker(node) {
    const marker = L.marker([node.lat, node.lon]).addTo(map);
    marker.on('click', () => onNodeSelected(node));
}

// Example nodes (replace with actual data from your backend or API)
const exampleNodes = [
    { id: 1, name: "Tower of London", lat: 51.5081, lon: -0.0759 },
    { id: 2, name: "Stonehenge", lat: 51.1789, lon: -1.8262 },
];

// Add example nodes to the map
exampleNodes.forEach(addNodeMarker);
