// Function to fetch Wikipedia content without using API keys
async function fetchWikipediaData(title) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&titles=${encodeURIComponent(title)}`;

    try {
        // Fetch data from Wikipedia API
        const response = await fetch(endpoint);
        const data = await response.json();

        // Extract the page data
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];  // Get the first (and only) page
        const extract = pages[pageId].extract;

        return extract || "No description available for this site."; // Handle missing description
    } catch (error) {
        console.error("Error fetching Wikipedia data:", error);
        return "Error fetching Wikipedia data.";  // Fallback error message
    }
}

// Function to display the Wikipedia content on the right panel
async function displayWikipediaContent(node) {
    // Assuming the node has a 'name' property or something else to fetch Wikipedia data
    const wikiTitle = node.name;  // Replace 'name' with the relevant property of your node

    const wikiIntro = await fetchWikipediaData(wikiTitle);

    // Update the right panel with the Wikipedia intro text
    const nodeDetailsElement = document.getElementById('nodeDetails');
    nodeDetailsElement.innerHTML = `
        <strong>${wikiTitle}</strong><br><br>
        ${wikiIntro}
    `;
}

// Assuming you have an event or logic where the node is selected
// Example: This should be triggered when a marker is clicked or when a node is selected
function onNodeSelect(node) {
    displayWikipediaContent(node);
}

// Example: if you have a marker with an event listener
// marker.on('click', () => onNodeSelect(marker));
