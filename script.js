const API_KEY = "153cf6e051db4ad592408e3411e561d0"; 
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
    const category = document.getElementById("category").value;
    fetchNews(category);
});

document.getElementById("category").addEventListener("change", (event) => {
    currentPage = 1;
    const category = event.target.value;
    fetchNews(category);
});

document.getElementById("search-button").addEventListener("click", () => {
    currentPage = 1;
    const searchQuery = document.getElementById("search-input").value;
    if (searchQuery) {
        fetchNews(null, searchQuery);
    }
});

document.getElementById("load-more").addEventListener("click", () => {
    const category = document.getElementById("category").value;
    const searchQuery = document.getElementById("search-input").value;
    currentPage++;
    fetchNews(category, searchQuery, currentPage);
});

const fetchNews = async (category, searchQuery = "", page = 1) => {
    const newsContainer = document.getElementById("news-articles");
    const errorMessage = document.getElementById("error-message");
    const loadMoreButton = document.getElementById("load-more");

    if (page === 1) {
        newsContainer.innerHTML = "";
    }

    errorMessage.classList.add("hidden"); 
    loadMoreButton.classList.add("hidden");

    try {
        // Build the API URL
        let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&page=${page}`;
        if (category) {
            apiUrl += `&category=${category}`;
        }
        if (searchQuery) {
            apiUrl += `&q=${encodeURIComponent(searchQuery)}`;
        }

        // Use an alternative proxy
        const proxyUrl = "https://api.allorigins.win/get?url=";
        const fullUrl = proxyUrl + encodeURIComponent(apiUrl);

        // Fetch news data
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data
        const data = await response.json();
        const articles = JSON.parse(data.contents).articles; // Parse the response from the proxy
        console.log("Articles received:", articles);

        // Check if articles are available
        if (!articles || articles.length === 0) {
            if (page === 1) {
                errorMessage.classList.remove("hidden");
            }
            return;
        }

        // Display the articles
        articles.forEach((article) => {
            const articleDiv = document.createElement("div");
            articleDiv.className = "news-article";
            articleDiv.innerHTML = `
                <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="News Image">
                <h2>${article.title}</h2>
                <p>${article.description || "No description available."}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(articleDiv);
        });

        // Show "Load More" button if there are more articles
        if (data.contents && JSON.parse(data.contents).totalResults > newsContainer.children.length) {
            loadMoreButton.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        errorMessage.innerText = "Error fetching news. Please try again later.";
        errorMessage.classList.remove("hidden");
    }
};
