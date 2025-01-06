const API_KEY = "153cf6e051db4ad592408e3411e561d0";

const start = () => {
    const category = document.getElementById("category").value;
    document.getElementById("welcome-page").classList.add("hidden");
    document.getElementById("news-page").classList.remove("hidden");
    fetchNews(category);
};

const fetchNews = async (category) => {
    const newsContainer = document.getElementById("news-articles");
    const errorMessage = document.getElementById("error-message");
    newsContainer.innerHTML = "";
    errorMessage.classList.add("hidden");

    try {
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=us&category=${category}`
        );
        const data = await response.json();

        if (!data.articles || data.articles.length === 0) {
            errorMessage.classList.remove("hidden");
            return;
        }

        data.articles.forEach((article) => {
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
    } catch (error) {
        console.error("Error fetching news:", error);
        errorMessage.innerText = "Error fetching news. Please try again later.";
        errorMessage.classList.remove("hidden");
    }
};
