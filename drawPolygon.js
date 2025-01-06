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
        console.error('Error fetching Wikipedia data:', error);
        return "Error fetching data from Wikipedia.";
    }
}
