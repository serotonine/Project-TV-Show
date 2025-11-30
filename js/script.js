import {
  getEpisode,
  searchEpisodes,
  populateEpisodeSelect,
} from "./episode.js";

//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  searchEpisodesPage();
  populateEpisodeSelect();
}

function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  const container = rootElem.querySelector(".episodes-wrapper");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;
  for (let episode of episodes) {
    container.append(getEpisode(episode));
  }
}

function searchEpisodesPage() {
  searchEpisodes();
}
function populateSelectEpisodes() {
  populateEpisodeSelect();
}
window.onload = setup;
