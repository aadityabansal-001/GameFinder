const API_KEY = "b1cc65c9b29646e1be9b83c68aa6270b";
const BASE_URL = "https://api.rawg.io/api/games";

const gamesContainer = document.getElementById("gamesContainer");
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const sortSelect = document.getElementById("sortSelect");
const darkModeToggle = document.getElementById("darkModeToggle");

let allGames = [];
let filteredGames = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function fetchGames() {
  try {
    gamesContainer.innerHTML = `<div class="loader"></div>`;

    const pages = 5;

    const requests = Array.from({ length: pages }, (_, i) =>
      fetch(`${BASE_URL}?key=${API_KEY}&page=${i + 1}`)
        .then(res => res.json())
    );

    const responses = await Promise.all(requests);

    allGames = responses.flatMap(res => res.results);
    filteredGames = [...allGames];

    displayGames(filteredGames);

  } catch (error) {
    console.error(error);
    gamesContainer.innerHTML = "<p>Error loading games</p>";
  }
}

function displayGames(games) {
  gamesContainer.innerHTML = "";

  games.forEach(game => {
    const card = document.createElement("div");
    card.classList.add("game-card");

    const isFav = favorites.includes(game.id);

    const genres = game.genres.map(g => `<span>${g.name}</span>`).join("");

    const platforms = game.parent_platforms
      ? game.parent_platforms.map(p => p.platform.name).join(", ")
      : "N/A";

    const image = game.background_image ||
      "https://via.placeholder.com/300x150?text=No+Image";

    card.innerHTML = `
      <img src="${image}" />

      <div class="overlay">
        <p><strong>Platforms:</strong> ${platforms}</p>
        <div class="genres">${genres}</div>
      </div>

      <div class="game-info">
        <h3>${game.name}</h3>
        <p>⭐ ${game.rating}</p>
        <p>📅 ${game.released}</p>
        <button class="fav-btn">${isFav ? "❤️" : "🤍"}</button>
      </div>
    `;

    card.querySelector(".fav-btn").addEventListener("click", () => {
      toggleFavorite(game.id);
    });

    gamesContainer.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayGames(filteredGames);
}

function applyFilters() {
  let result = [...allGames];

  const searchValue = searchInput.value.toLowerCase();

  result = result.filter(game =>
    game.name.toLowerCase().includes(searchValue)
  );

  if (genreFilter.value !== "all") {
    result = result.filter(game =>
      game.genres.some(g => g.name === genreFilter.value)
    );
  }

  if (sortSelect.value === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  }

  if (sortSelect.value === "date") {
    result.sort((a, b) =>
      new Date(b.released) - new Date(a.released)
    );
  }

  filteredGames = result;
  displayGames(filteredGames);
}

searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

fetchGames();