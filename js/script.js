import {
  getAllEpisodes,
  searchEpisodes,
  populateEpisodeSelect,
  makePageForEpisodes,
} from "./includes/episode.js";
import {
  makePageForShows,
  populateShowSelect,
  searchShows,
} from "./includes/show.js";
import { fetchData } from "./includes/httpRequests.js";

let currentDisplay;
// Datas.
let allEpisodes;
let allShows;

// Set Up.
function setup() {
   const dom = getDomEl();
  
  fetchData()
    .then((shows) => {
      populateShowSelect(dom.showSelect, shows);
      makePageForShows(dom.container, shows );
      currentDisplay = "shows";
      allShows = shows;
      // Search-container handle events.
      setListeners(dom);
    })
    .catch((error) => {
      document.querySelector(".error").innerHTML = error.message;
    });
}
// Retrieve all DOM Elements.
function getDomEl() {
  return {
    rootElem: document.getElementById("root"),
    container: document.getElementById("main-wrapper"),
    searchContainer: document.getElementById("search-container"),
    showSelect:document.getElementById("show-select"),
    episodeInput: document.getElementById("search-input"),
    episodeSelect: document.getElementById("episode-select"),
    episodeCount: document.getElementById("search-count"),
  };
}
// Handle all events.
function setListeners(dom){
  const {searchContainer,container } = dom;
  // Select
  searchContainer.addEventListener("select-change", async function(e){
    const target =e.target.id;
    const id = e.detail.id;
    switch(target){
      case "show-select":
       allEpisodes =  await getAllEpisodes(id);
        makePageForEpisodes(dom , allEpisodes);
        populateEpisodeSelect(dom, allEpisodes);
        currentDisplay = "episodes";
        break;
      case "episode-select":
        console.log("episode-select change detected");
      break;
    }
  });
  // Input.
  searchContainer.addEventListener("input", function (e) {
    const target = e.target;
    const tag = e.target.tagName;
    if (tag === "INPUT") {
      if (currentDisplay === "episodes" && allEpisodes) {
        searchEpisodes(dom, target.value, allEpisodes);
      }
      if (currentDisplay === "shows" && allShows) {
        searchShows(dom, target.value, allShows);
      }
    }
  });

  searchContainer.addEventListener("click", function(e){
    
    if(e.target.id != "btn-show-cta"){ return; }
    console.log(e.target.id);
    makePageForShows(dom.container, allShows );
  });
  
  container.addEventListener("click", async function(e){
    const show = e.target.closest(".show");
    if(!show){ return; }
    const id = show.dataset.id;
    if(!id){ return; }
    allEpisodes =  await getAllEpisodes(id);
        makePageForEpisodes(dom , allEpisodes);
        populateEpisodeSelect(dom, allEpisodes);
        currentDisplay = "episodes";
  });

}



window.onload = setup;
