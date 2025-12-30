import ShowRender from "./ShowRender.js";
import ShowGenres from "./ShowGenres.js";
import ShowSort from "./ShowSort.js";
import Favorites from "../Favorites.js";

export default class Show {
  constructor(dom, allShowsRaw) {
    this.dom = dom;
    this.allShowsRaw = allShowsRaw;
    // Composition.
    this.showRender = new ShowRender(dom);
    this.showGenres = new ShowGenres(dom, allShowsRaw);
    this.showSort = new ShowSort(allShowsRaw);
  }

  /**
   * Returns the container where all the Show items are displayed.
   * @returns {HTMLElement}
   */
  get container() {
    return this.dom.elements.container;
  }
  /**
   * Trigger all the Show methods needed on setup.
   * @returns {array} - Shows list sorted alphabetically.
   */
  async init(){
    const allShows = this.showSort.alphabeticalSort(this.allShowsRaw);
     // populate Shows container.
    await this.makePageForShows(allShows);
    // Set Opacity to 1 once img is loaded.
     this.displayPageForShows();
    // Populate Shows Select.
    this.showRender.populateShowSelect(allShows);
    // Display all genres buttons.
    this.showGenres.populateGenres();
    return allShows;
  }

  /**
   * Sort the shows list by favorites.
   * @returns {Array} The sorted list.
   */
  favoriteSort() {
    const favorites = Favorites.getFavorites();
    return this.showSort.alphabeticalSort(favorites);
  }

  /**
   * Determine the type of sort and display the sorted shows.
   * @param {string} value - The sort type.
   * @returns {number} The number of shows displayed.
   */
  async sortPageForShows(value) {
    let sortedShows;
    switch (value) {
      case "name":
        sortedShows = this.showSort.alphabeticalSort(this.allShowsRaw);
        break;
      case "start":
        sortedShows = this.showSort.startSort();
        break;
      case "favorites":
        sortedShows = this.favoriteSort();
        break;
      default:
        sortedShows = this.allShowsRaw;
    }
    await this.makePageForShows(sortedShows);
    this.displayPageForShows();
    return sortedShows.length;
  }

  /**
   * Display Shows.
   * @param {array} the shows list.
   * @returns {Promise}
   */
  async makePageForShows(allShows) {

    if (!Array.isArray(allShows) || !allShows.length) {
      this.dom.setError("Show list is wrong. Check why.");
      return Promise.resolve();
    }
    this.dom.resetContainer();
    this.container.classList.toggle("shows-wrapper", true);
    const fragment = document.createDocumentFragment();
    const visibleImagePromises = [];

    for (let show of allShows) {
      const showEl = this.showRender.createShowElement(show);
      fragment.appendChild(showEl);
    }
    this.container.appendChild(fragment);
    // Reflow.
    void this.container.offsetHeight;

    const articles = this.container.querySelectorAll(".show");

    articles.forEach((article) => {
      const img = article.querySelector("img");
      if (!img) return;

      if (img.complete && img.naturalHeight !== 0) {
        return;
      }

      if (this.dom.isInViewport(article)) {
        visibleImagePromises.push(
          new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
        );
      }
    });

    if (visibleImagePromises.length === 0) {
      return Promise.resolve();
    }
    return Promise.all(visibleImagePromises);
  }

  /**
   * Display Sorted Shows.
   * @param {Array} sortedShows - The sorted shows to display.
   * @returns {void}
   */
  makePageForSortedShows(sortedShows) {
    this.dom.resetContainer();
    const fragment = document.createDocumentFragment();

    for (let show of sortedShows) {
      const current = this.createShowElement(show);
      current.classList.add("loaded");
      fragment.appendChild(current);
    }
    this.container.appendChild(fragment);
  }

  /**
   * Add class "loaded" to set opacity:1.
   * @returns {void}
   */
  displayPageForShows() {
    const articles = this.container.querySelectorAll(".show");
    articles.forEach((article) => {
      article.classList.add("loaded");
    });
  }

  /**
   * Search shows by genres.
   * @param {NodeList} allGenreActive - The active genre buttons.
   * @param {Array} allShows - The list of all shows.
   * @returns {Promise<void>}
   */
  async searchShowsByGenres(allGenreActive, allShows) {
    const actives = Array.from(allGenreActive).map((node) => node.dataset.name);
    const filteredShows = allShows.filter((show) =>
      actives.every((genre) => show.genres.includes(genre))
    );
    let message = "";
    const lg = filteredShows.length;
    if (lg > 0) {
      await this.makePageForShows(filteredShows);
      this.displayPageForShows();
      message = `Displaying ${lg} Show${lg > 1 ? "s" : ""}.`;
    } else {
      message = `No Show found.`;
    }
    this.dom.setCount(message);
  }

  /**
   * Search shows by name or genre.
   * @param {string} value - The search term.
   * @param {Array} allShows - The list of all shows.
   * @returns {Promise<void>}
   */
  async searchShows(value, allShows) {
    const searchTerm = value.toLowerCase();
    this.dom.resetContainer();
    const filteredShows = allShows.filter((show) => {
      const nameMatch = show.name.toLowerCase().includes(searchTerm);
      const genreMatch = show.genres.some(
        (genre) => genre.toLowerCase() === searchTerm
      );
      return nameMatch || genreMatch;
    });
    let message = "";
    const lg = filteredShows.length;
    if (lg > 0) {
      await this.makePageForShows(filteredShows);
      this.displayPageForShows();
      message = `Displaying ${lg} Show${lg > 1 ? "s" : ""}.`;
    } else {
      message = `No Show found.`;
    }
    this.dom.setCount(message);
  }
}

