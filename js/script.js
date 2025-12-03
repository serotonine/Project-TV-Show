import {
  getAllEpisodes,
  getEpisode,
  searchEpisodes,
  populateEpisodeSelect,
} from "./episode.js";

//You can edit ALL of the code here.
function setup() {
  getAllEpisodes()
    .then((allEpisodes) => {
      document.getElementById("search-container").classList.remove('hidden');
      makePageForEpisodes(allEpisodes);
      searchEpisodes(allEpisodes);
      populateEpisodeSelect(allEpisodes);
    })
    .catch((error) => {
      document.querySelector(".error").innerHTML = error.message;
    });
}

function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  const container = rootElem.querySelector(".episodes-wrapper");
  for (let episode of episodes) {
    container.append(getEpisode(episode));
  }
}

window.onload = setup;
