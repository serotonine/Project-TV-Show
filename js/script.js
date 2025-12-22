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
      makePageForShows(dom.container, shows);
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
    title: document.querySelector(".page-title-current"),
    rootElem: document.getElementById("root"),
    container: document.getElementById("main-wrapper"),
    searchContainerWrapper: document.getElementById("search-container-wrapper"),
    searchContainer: document.getElementById("search-container"),
    showSelect: document.getElementById("show-select"),
    episodeSelect: document.getElementById("episode-select"),
    episodeCount: document.getElementById("search-count"),
    searchInput: document.getElementById("search-input"),
    btnShowCta: document.getElementById("btn-show-cta"),
  };
}

// Handle all events.
function setListeners(dom) {
  const { searchContainer, container } = dom;

  // Handle show selection.
  // See show.js > customEvt.
  searchContainer.addEventListener("select-change", async function (e) {
    // Retrieve infos about selected show.
    const { title, id } = e.detail;
    setTitle(title);
    allEpisodes = await getAllEpisodes(id);
    // Display the current show.
    makePageForEpisodes(dom, allEpisodes);
    populateEpisodeSelect(dom, allEpisodes);
    currentDisplay = "episodes";
    handleSearchDisplay();
  });

  // Handle Search input.
  searchContainer.addEventListener("input", function (e) {
    const target = e.target;
    const tag = e.target.tagName;
    if (tag === "INPUT") {
      if (currentDisplay === "episodes" && allEpisodes) {
        dom.episodeSelect.selectedIndex = 0;
        if(target.value){
           searchEpisodes(dom, target.value, allEpisodes);
        }
      }
      if (currentDisplay === "shows" && allShows) {
        dom.showSelect.selectedIndex = 0;
        if(target.value.length > 1){
          searchShows(dom, target.value, allShows);
        }
      }
    }
  });
/*   searchContainer.addEventListener("focus", function (e) {
    console.dir(e.target);
    e.target.value="";
  }); */
  // Handle "All TV Show" button event.
  searchContainer.addEventListener("click", function (e) {
    if (e.target.id != "btn-show-cta") {
      return;
    }
    // TODO : more dynamic.
    dom.showSelect.closest(".search-field").classList.toggle("none");
    dom.episodeSelect.closest(".search-field").classList.toggle("none");
    dom.btnShowCta.closest(".search-field").classList.toggle("none");
    makePageForShows(dom.container, allShows);
  });

  // Handle episodes display on show item click.
  container.addEventListener("click", async function (e) {
    const show = e.target.closest(".show");
    if (!show) {
      return;
    }
    const { title, id } = show.dataset;
    if (!id || !title) {
      return;
    }

    allEpisodes = await getAllEpisodes(id);
    currentDisplay = "episodes";
    makePageForEpisodes(dom, allEpisodes);
    populateEpisodeSelect(dom, allEpisodes);
    setTitle(title);
    handleSearchDisplay();
  });
}
// Handle inputs display.
function handleSearchDisplay() {
  // Hide on setUp()
  const inputLabel = dom.searchInput.previousElementSibling;
  if (currentDisplay === "shows") {
    dom.searchContainerWrapper.classList.remove("hidden");
    dom.searchInput.placeholder = "Search for a show";
    dom.episodeSelect.closest(".search-field").classList.toggle("none");
    dom.btnShowCta.closest(".search-field").classList.toggle("none");
  }
  if (currentDisplay === "episodes") {
    dom.searchContainerWrapper.classList.remove("hidden");
    dom.searchInput.placeholder = "Search for an episode";
    dom.showSelect.closest(".search-field").classList.toggle("none");
    dom.episodeSelect.closest(".search-field").classList.toggle("none");
    dom.btnShowCta.closest(".search-field").classList.toggle("none");
  }
}
// Handle Title text content.
function setTitle(txt) {
  dom.title.textContent = txt;
}

window.onload = setup;
