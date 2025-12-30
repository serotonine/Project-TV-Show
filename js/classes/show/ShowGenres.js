export default class ShowGenres{
  constructor(dom, allShows){
    this.allShows = allShows;
    this.dom = dom;
  }
  /**
   * Populate the genres container.
   * @returns {void}
   */
  populateGenres() {
    const allGenres = new Set();
    const {genresContainer:container} = this.dom.elements;
    for (let show of this.allShows) {
      if (show.genres) {
        show.genres.forEach((genre) => allGenres.add(genre));
      }
    }
    allGenres.forEach((genre) => {
      const btn = this.createGenreButton(genre);
      container.appendChild(btn);
    });
  }
  /**
   * Create a genre button.
   * @param {string} genre - The genre name.
   * @returns {HTMLElement} - The genre button.
   */
  createGenreButton(genre) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-genre";
    btn.dataset.name = genre;
    btn.textContent = genre;
    return btn;
  }
}
