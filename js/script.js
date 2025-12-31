import { fetchData } from "./includes/httpRequests.js";
// All about the DOM.
import Dom from "./classes/Dom.js";
// All about the Shows.
import Show from "./classes/show/Show.js";
// All about the favorites Shows.
import Favorites from "./classes/Favorites.js";
// All about the episodes.
import Episode from "./classes/episode/Episode.js";

// shows or episodes.
let currentDisplay;
// Datas.
let allEpisodes;
let allShows;
// DOM.
let dom;
// Shows.
let shows;
// Episodes.
let episodes;

// Set Up.
function setup() {

  // Classes instantiation.
  dom = new Dom();
  episodes = new Episode(dom);
  // Loader init.
  dom.addLoader("Shows");
  // Back to top;
  dom.backToTop();

  // Let's partying ! 
  fetchData()
    .then(async (response) => {
      // Store the whole shows.
      allShows = response;
      // Useful for Search Inputs.
      currentDisplay = "shows";
      // Classes instantiation.
      shows = new Show(dom, allShows);
      /* 
       * Wait images loaded.
       * All shows displayed
       * Select and genres displayed.
      */
     // Usefull when back to shows.
      allShows = await shows.init();
      handleSearchDisplay();
      dom.removeLoader();
      dom.setCount(`Display ${allShows.length} Shows`);
      // Search-container handle events.
      setListeners(dom);
    })
    .catch((error) => {
      dom.setError("Error: " + error.stack);
    });
}

// Handle all events.
function setListeners(dom) {
  const { searchContainer, genresContainer, container } = dom.elements;

  // Handle Search input.
  searchContainer.addEventListener("input", async function (e) {
    const target = e.target;
    const tag = e.target.tagName;
    dom.resetGenres();
    if (tag === "INPUT") {

      dom.resetSelect();

      if (currentDisplay === "episodes") {
        if (target.value) {
          episodes.searchEpisodes(target.value);
        }
      }
      if (currentDisplay === "shows" && allShows) {
        let isEmpty = true;
        if (target.value.length >= 1) {
          isEmpty = false;
          shows.searchShows(target.value, allShows);
        }
        if (isEmpty) {
          shows.makePageForShows(allShows);
        }
      }
    }
    if (tag === "SELECT") {

      dom.resetContainer();
      dom.resetSearchInput();

      if (e.target.id === "show-select") {
        currentDisplay = "episodes";
        const selectedShowId = e.target.value || null;
        const selectedShowTitle = e.target.selectedOptions[0].text;
        await episodes.init(selectedShowId, selectedShowTitle);
        handleSearchDisplay();
      }
      else if (e.target.id === "episode-select") {
        episodes.getSelectedEpisode(e.target.value || null, allEpisodes);
      }
      else if (e.target.id === "display-select") {
        const count = await shows.sortPageForShows(e.target.value, allShows);
        dom.setCount(`Display ${count} show${
          count > 1 ? "s" : ""
        }.`);
      } else {
        return;
      }
    }
  });

  // Handle genres buttons event.
  genresContainer.addEventListener("click", async function (e) {
    e.target.classList.toggle("active");
    dom.resetContainer();
    dom.resetSelect();
    dom.addLoader("shows");
    const actives = document.querySelectorAll(".btn-genre.active");
    await shows.searchShowsByGenres(actives, allShows);
    dom.removeLoader();
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
    dom.resetContainer();
    dom.resetSelect();
    dom.addLoader(currentDisplay);
    await shows.makePageForShows(allShows);
    shows.displayPageForShows();
    dom.removeLoader();
    handleSearchDisplay();
    dom.setCount(`Display ${allShows.length} Shows`);
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
    dom.resetContainer();
    dom.resetSearchInput();

    if (e.target.classList.contains("heart")) {
      Favorites.handleFavorites(id, allShows);
      e.target.classList.toggle("active");
    } else {
      currentDisplay = "episodes";
      await episodes.init(id, title);
      handleSearchDisplay();
    }
  });
}
// Handle inputs display.
function handleSearchDisplay() {
   
  dom.resetSearchInput();
  dom.resetSelect();

  const { 
    searchContainerWrapper,
    showSelect,
    episodeSelect,
    btnShowCta,
    displaySelect,
    searchInput,
    genresContainer } = dom.elements;

  if (currentDisplay === "shows") {
    dom.setTitle("All TV shows");
    dom.toggleNone(btnShowCta);
    searchInput.placeholder = "Search for a show";
    genresContainer.classList.remove("none");
    searchContainerWrapper.classList.remove("hidden");
    showSelect.closest(".search-field").classList.remove("none");
    episodeSelect.closest(".search-field").classList.add("none");
    displaySelect.closest(".search-field").classList.remove("none");
  }
  if (currentDisplay === "episodes") {
    dom.resetGenres();
    dom.toggleNone(showSelect, episodeSelect, btnShowCta, displaySelect);
    searchInput.placeholder = "Search for an episode";
    searchContainerWrapper.classList.remove("hidden");
    genresContainer.classList.toggle("none");
  }
}

window.onload = setup;
