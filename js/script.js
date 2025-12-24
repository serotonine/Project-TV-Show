import { fetchData } from "./includes/httpRequests.js";
import {
  getDomEl,
  setLoader,
  addLoader,
  removeLoader,
} from "./includes/dom.js";
import {
  getAllEpisodes,
  searchEpisodes,
  getSelectedEpisode,
  populateEpisodeSelect,
  makePageForEpisodes,
} from "./includes/episode.js";
import {
  makePageForShows,
  displayPageForShows,
  populateGenres,
  searchShowsByGenres,
  populateShowSelect,
  searchShows,
} from "./includes/show.js";

// shows or episodes.
let currentDisplay;
// Datas.
let allEpisodes;
let allShows;
// DOM.
let dom;

// Set Up.
function setup() {
  dom = getDomEl();
  // Loader init.
  setLoader();
  addLoader("Shows");
  fetchData()
    .then(async (shows) => {
      // Store the whole shows.
      allShows = shows;
      // Useful for Search Inputs.
      currentDisplay = "shows";
      // Wait images loaded.
      await makePageForShows(allShows);
      displayPageForShows();
      populateShowSelect(allShows);
      populateGenres(allShows);

      handleSearchDisplay();
      removeLoader();
      dom.episodeCount.textContent = `Display ${allShows.length} Shows`;
      // Search-container handle events.
      setListeners(dom);
    })
    .catch((error) => {
      dom.errorElem.innerHTML = "Error: " + error.message;
    });
}

// Handle all events.
function setListeners(dom) {
  const { searchContainer, genresContainer, container } = dom;

  // Handle Search input.
  searchContainer.addEventListener("input", async function (e) {
    const target = e.target;
    const tag = e.target.tagName;
    if (tag === "INPUT") {
      if (currentDisplay === "episodes" && allEpisodes) {
        dom.episodeSelect.selectedIndex = 0;
        if (target.value) {
          searchEpisodes(target.value, allEpisodes);
        }
      }
      if (currentDisplay === "shows" && allShows) {
        dom.showSelect.selectedIndex = 0;
        let isEmpty = true;
        if (target.value.length >= 1) {
          isEmpty = false;
          searchShows(target.value, allShows);
        }
        if (isEmpty) {
          makePageForShows(allShows);
        }
      }
    }
    if (tag === "SELECT") {
      if (e.target.id === "show-select") {
        container.innerHTML = "";
        addLoader("episodes");
        const selectedShowId = e.target.value || null;
        const selectedShowTitle = e.target.selectedOptions[0].text;
        // Fetch episodes or retrieve from storage.
        allEpisodes = await getAllEpisodes(selectedShowId);
        currentDisplay = "episodes";
        // Display the current Show.
        setTitle(selectedShowTitle);
        // removeLoader();
        await makePageForEpisodes(allEpisodes);
        populateEpisodeSelect(allEpisodes);
        handleSearchDisplay();
      } else if (e.target.id === "episode-select") {
        // Empty search input.
        dom.searchInput.value = "";
        getSelectedEpisode(e.target.value || null, allEpisodes);
      } else {
        return;
      }
    }
  });
  // Handle genres select.
  genresContainer.addEventListener("click", async function (e) {
    e.target.classList.toggle("active");
    const actives = document.querySelectorAll(".btn-genre.active");
    dom.container.innerHTML = "";
    addLoader("shows");
    await searchShowsByGenres(actives, allShows);
    removeLoader();
  });

  // Empty Search-input on focus.
  searchContainer.addEventListener("focusin", function (e) {
    if (e.target.tagName === "INPUT") {
      e.target.value = "";
    }
  });
  // Handle "All TV Show" Button Event.
  searchContainer.addEventListener("click", async function (e) {
    if (e.target.id != "btn-show-cta") {
      return;
    }
    currentDisplay = "shows";
    // Empty container.
    dom.container.innerHTML = "";
    addLoader(currentDisplay);
    await makePageForShows(allShows);
    removeLoader();
    displayPageForShows();
    handleSearchDisplay();
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
    currentDisplay = "episodes";
    allEpisodes = await getAllEpisodes(id);
    dom.container.innerHTML = "";
    await makePageForEpisodes(allEpisodes);
    populateEpisodeSelect(allEpisodes);
    setTitle(title);
    handleSearchDisplay();
  });
}
// Handle inputs display.
function handleSearchDisplay() {
  dom.searchInput.value = "";
  dom.episodeCount.textContent = "";
  if (currentDisplay === "shows") {
    dom.showSelect.selectedIndex = 0;
    setTitle("All TV shows");
    dom.searchContainerWrapper.classList.remove("hidden");
    dom.searchInput.placeholder = "Search for a show";
    dom.genresContainer.classList.remove("none");
    dom.showSelect.closest(".search-field").classList.remove("none");
    dom.episodeSelect.closest(".search-field").classList.add("none");
    dom.btnShowCta.closest(".search-field").classList.toggle("none");
  }
  if (currentDisplay === "episodes") {
    dom.searchContainerWrapper.classList.remove("hidden");
    dom.searchInput.placeholder = "Search for an episode";
    Array.from(dom.genresContainer.children).forEach((g) =>
      g.classList.remove("active")
    );
    dom.genresContainer.classList.toggle("none");
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
