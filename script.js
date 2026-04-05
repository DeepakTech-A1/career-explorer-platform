// Fetch latest AI news
async function fetchNews() {
  try {
    const res = await fetch("https://aichief.com/news/");
    const text = await res.text();
    document.getElementById("news-container").innerHTML = text.slice(0, 500) + "..."; 
  } catch (err) {
    document.getElementById("news-container").textContent = "Error loading news.";
  }
}
setInterval(fetchNews, 60000); // refresh every 1 min
fetchNews();

// Beginner Mode tooltip
document.getElementById("start-here").addEventListener("click", () => {
  alert("Welcome beginner! Start with Explore AI Fields → Career Roadmap → AI Tools.");
});

// Search functionality
const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = sec.textContent.toLowerCase().includes(query) ? "block" : "none";
  });
});
