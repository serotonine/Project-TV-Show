import Favorites from "../Favorites.js";

export default class ShowRender {
  constructor(dom) {
    this.dom = dom;
  }
  /**
   * Returns the container where all the Episode items are displayed.
   * @returns {HTMLElement}
   */
  get container() {
    return this.dom.elements.container;
  }
  /**
   * Creates and returns a DOM element for a show.
   * @param {Object} show - The show object containing the data.
   * @returns {HTMLElement} - An article element representing the show.
   */
  createShowElement(show) {
    // article.
    const article = document.createElement("article");
    article.dataset.id = show.id;
    article.dataset.title = show.name;
    article.className = "show";
    article.setAttribute("tabindex", "0");

    // Figure.
    const figure = document.createElement("figure");
    figure.className = "show-image";

    // Image.
    if (show.image && show.image.medium) {
      const img = document.createElement("img");
      img.src = show.image.medium;
      img.alt = `${show.name} thumbnail`;
      figure.appendChild(img);
    }
    article.appendChild(figure);

    // Content.
    const content = document.createElement("div");
    content.className = "show-body";

    // Title.
    const title = document.createElement("h2");
    title.textContent = show.name;
    content.appendChild(title);

    // Summary.
    const summary = document.createElement("div");
    summary.className = "summary show-summary";
    summary.innerHTML = this.dom.cleanSummary(show.summary);
    content.appendChild(summary);

    // Genres.
    const genres = document.createElement("div");
    genres.className = "show-genres";
    show?.genres.forEach((genre) => {
      genres.innerHTML += `<button class="btn show-genre" type="button">${genre}</button>`;
    });
    content.appendChild(genres);

    // Start-end.
    const startEnd = document.createElement("p");
    startEnd.className = "show-start-end";
    startEnd.innerHTML = `<small><b>${show.premiered || "N/A"} | ${
      show.ended || "Present"
    }</b></small>`;
    content.appendChild(startEnd);

    // rating.
    const rating = document.createElement("p");
    rating.className = "show-rating";
    const average = Math.round(show.rating.average || 0);
    rating.innerHTML =
      `<span class="active">&#x2605;</span>`.repeat(average) +
      `<span>&#x2605;</span>`.repeat(10 - average);
    content.appendChild(rating);
    // Link to Official Website.
    if (show.officialSite) {
      const link = document.createElement("a");
      link.className="show-link";
      link.href = show.officialSite;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<span>Official Site</span>${this.dom.SVGLink}`;
      content.appendChild(link);
    }
    // Favorite.
    const favorite = document.createElement("div");
    favorite.className = "heart";
    if (Favorites.isFavorite(show.id)) {
      favorite.classList.add("active");
    }
    content.appendChild(favorite);
    article.appendChild(content);
    return article;
  }

  /**
   * Populate the select element with all the shows.
   * @param {array} the sorted shows list.
   * @returns {void}
   */
  populateShowSelect(allShows) {
    const { showSelect } = this.dom.elements;
    for (let show of allShows) {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    }
  }
}
