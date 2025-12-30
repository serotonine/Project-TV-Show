export default class EpisodeRender {
  constructor(dom) {
    this.dom = dom;
  }
  /**
   * Creates and returns a DOM element for an episode.
   * @param {Object} episode - The episode object containing the data.
   * @returns {HTMLElement} - An article element representing the episode.
   */
  createEpisodeElement(episode) {
    const { id, url, name, season, number, image, summary } = episode;

    // Define.
    const article = document.createElement("article");
    const banner = document.createElement("div");
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const body = document.createElement("div");

    // Set attributes.
    article.classList.add("episode");
    banner.classList.add("episode-banner");
    figure.classList.add("episode-figure");
    body.classList.add("episode-body");
    article.dataset.id = id;
    article.setAttribute("aria-label", name);

    // Populate with values.
    const episodeId = `S${("" + season).padStart(2, "0")}E${(
      "" + number
    ).padStart(2, "0")}`;
    banner.innerHTML = `<p>${episodeId}</p>`;
    body.innerHTML = `<h2>${name}</h2>
    <p>${summary}</p>
    <p class="episode-link">
    <a href=${url} alt=${episodeId} target="_blank">
    <span>Watch on Maze</span>
    ${this.dom.SVGLink}
</a></p>`;
    // Append.
    figure.appendChild(img);
    article.appendChild(banner);
    article.appendChild(figure);
    article.appendChild(body);
    // Handle Image.
    if (image?.medium) {
      img.src = image?.medium;
      img.alt = name;
      img.width = 250;
      img.height = 140;

      img.onload = () => {
        article.classList.add("loaded");
      };

      img.onerror = () => {
        // Avoid blocking.
        article.classList.add("loaded");
      };

      figure.appendChild(img);
    } else {
      // No image.
      article.classList.add("loaded");
    }
    return article;
  }

  /**
   * Populate the select element with all the shows.
   * @param {array} the episodes list.
   * @returns {void}
   */
  populateEpisodeSelect(allEpisodes) {
    const { episodeSelect, searchInput } = this.dom.elements;
    const episodesBySeason = this.getEpisodesBySeason(allEpisodes);
    //searchInput.innerHTML = "";
    episodesBySeason.forEach((episodes, season) => {
      const nbTxt = (nb) => ("" + season).padStart(2, "0");
      const optGroup = document.createElement("optgroup");
      optGroup.label = `Season ${nbTxt(season)}`;
      const optionSeason = document.createElement("option");
      optionSeason.value = "S" + season;
      optionSeason.textContent = `SEASON ${nbTxt(season)} ALL EPISODES`;
      optGroup.appendChild(optionSeason);
      episodes.forEach((episode) => {
        const option = document.createElement("option");
        const episodeId = `S${nbTxt(season)}E${nbTxt(episode.number)}`;
        option.value = episode.id;
        option.textContent = `${episodeId} - ${episode.name}`;
        optGroup.appendChild(option);
      });
      episodeSelect.appendChild(optGroup);
    });
  }

  //
  /**
   * Group episodes by Season.
   * @param {array} allEpisodes - The episodes list.
   * @returns {array}
   */
  getEpisodesBySeason(allEpisodes) {
    const map = new Map();
    return allEpisodes.reduce((acc, current) => {
      const currentNumbers = acc.get(current.season) || [];
      return acc.set(current.season, [...currentNumbers, current]);
    }, map);
  }
}
