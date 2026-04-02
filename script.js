const API_KEY = "b1cc65c9b29646e1be9b83c68aa6270b";
const BASE_URL = "https://api.rawg.io/api/games";

const gamesContainer = document.getElementById("gamesContainer");
const darkModeToggle = document.getElementById("darkModeToggle");

let allGames = [];

async function fetchGames() {
  try {
    gamesContainer.innerHTML = "<p>Loading games...</p>";

    const pages = 5;

    const requests = Array.from({ length: pages }, (_, i) =>
      fetch(`${BASE_URL}?key=${API_KEY}&page=${i + 1}`)
        .then(res => res.json())
    );

    const responses = await Promise.all(requests);

    allGames = responses.flatMap(res => res.results);

    displayGames(allGames);

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

    const image = game.background_image || "https://via.placeholder.com/300x150?text=No+Image";

    card.innerHTML = `
      <img src="${image}" />
      <div class="game-info">
        <h3>${game.name}</h3>
        <p>⭐ ${game.rating}</p>
        <p>📅 ${game.released}</p>
      </div>
    `;

    gamesContainer.appendChild(card);
  });
}

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

fetchGames();