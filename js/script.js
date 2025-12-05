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
// shows or episodes.
let currentDisplay;
// Datas.
let allEpisodes;
let allShows;
// DOM.
const dom = getDomEl();

// Set Up.
function setup() {
   
  fetchData()
    .then((shows) => {
      currentDisplay = "shows";
      handleSearchDisplay();
      populateShowSelect(dom.showSelect, shows);
      makePageForShows(dom.container, shows );
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
    searchContainerWrapper:document.getElementById("search-container-wrapper"),
    searchContainer: document.getElementById("search-container"),
    showSelect:document.getElementById("show-select"),
    episodeInput: document.getElementById("search-input"),
    episodeSelect: document.getElementById("episode-select"),
    episodeCount: document.getElementById("search-count"),
    btnShowCta: document.getElementById("btn-show-cta"),
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
        handleSearchDisplay();
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
        handleSearchDisplay();
  });

}
function handleSearchDisplay(){
  // Hide on setUp()
 const inputLabel = dom.episodeInput.previousElementSibling;
  //console.log(label);
  if(currentDisplay === "shows"){
    dom.searchContainerWrapper.classList.remove("hidden");
    inputLabel.textContent="Search for a show";
    dom.episodeSelect.closest(".search-field").classList.toggle("none");
    dom.btnShowCta.closest(".search-field").classList.toggle("none");
    
  }
  if(currentDisplay === "episodes"){
    dom.searchContainerWrapper.classList.remove("hidden");
    inputLabel.textContent="Search for an episode";
    dom.episodeSelect.closest(".search-field").classList.toggle("none");
    dom.btnShowCta.closest(".search-field").classList.toggle("none");
  }
}



window.onload = setup;
