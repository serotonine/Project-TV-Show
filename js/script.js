import {
  getAllEpisodes,
  getEpisode,
  searchEpisodes,
  populateEpisodeSelect,
  getAllShows,
  populateShowSelect,
  setupShowSelectListener,
  makePageForEpisodes,
} from "./episode.js";

//You can edit ALL of the code here.
function setup() {
  getAllShows()
    .then((allShows) => {
      populateShowSelect(allShows);
      setupShowSelectListener(allShows);
    })
    .catch((error) => {
      document.querySelector(".error").innerHTML = error.message;
    });
}

window.onload = setup;
