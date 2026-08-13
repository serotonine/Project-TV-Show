import { fetchData } from "../../includes/httpRequests.js";
import EpisodeRender from "./EpisodeRender.js";
import SlideShow from "../../includes/slideshow/SlideShow.js";

export default class Episode {
  constructor(dom) {
    this.dom = dom;
    this.episodeRender = new EpisodeRender(dom);
    this.episodeCache = {};
    this.allEpisodes = [];
    this.showId = null;
  }
  /**
   * Returns the container where all the Episode items are displayed.
   * @returns {HTMLElement}
   */
  get container() {
    return this.dom.elements.container;
  }

  /**
   * Group process to display a Show episode.
   * @param {number || string} showId - The show id.
   * @param {string} title - The show name.
   * @returns {void}
   */
  async init(showId, title) {
    this.showId = showId;
    this.dom.addLoader("episodes");
    // Fetch episodes or retrieve from storage.
    this.allEpisodes = await this.getAllEpisodes(showId);
    this.dom.setTitle(title);
    await this.createEpisodesBySeasons(this.allEpisodes);
    this.episodeRender.populateEpisodeSelect(this.allEpisodes);
    this.dom.removeLoader();
  }

  /**
   * Search shows by name or genre.
   * @param {number || string} showId - The show id.
   * @returns {void}
   */
  async getAllEpisodes(showId) {
    if (this.episodeCache[showId]) {
      // Return cached data.
      return this.episodeCache[showId];
    }
    try {
      const AllEpisodes = await fetchData(showId);
      // Store in cache.
      this.episodeCache[showId] = AllEpisodes;
      return AllEpisodes;
    } catch (error) {
      this.dom.setError(error.stack);
      throw error;
    }
  }

  /**
   * Display all episodes g.
   * @param {array} episodes - The episodes list.
   * @returns {Promise<void>}
   */
  async createEpisodesBySeasons(allEpisodes) {
    const seasons = this.episodeRender.getEpisodesBySeason(allEpisodes);
    for (let [nb, episodes] of seasons){
      const section = document.createElement("section");
      section.className = "season";
      const seasonTitle = document.createElement("h5");
      seasonTitle.textContent = `Season ${nb}`;
      section.appendChild(seasonTitle);
      const slides = await this.createEpisode(episodes,section);
      const slideShow = new SlideShow(`${this.showId}-S${nb}`,section, slides);
      this.container.appendChild(section);
      slideShow.init();
    }
 
  }

  /**
   * Display all episodes with proper loading.
   * @param {array} episodes - The episodes list.
   * @returns {Promise<void>}
   */
  async createEpisode(episodes, container) {
    const fragment = new DocumentFragment();
    const visibleImagePromises = [];

    // Create all episodes.
    for (let episode of episodes) {
      const article = this.episodeRender.createEpisodeElement(episode);
      fragment.appendChild(article);

      // Collect promise only for visible images.
      const img = article.querySelector("img");
      if (img && !img.complete) {
        const isVisible = () => {
          const rect = article.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        };

        if (isVisible()) {
          visibleImagePromises.push(
            new Promise((resolve) => {
              img.onload = () => {
                article.classList.add("loaded");
                resolve();
              };
              img.onerror = () => {
                article.classList.add("loaded");
                resolve();
              };
            }),
          );
        } else {
          img.onload = img.onerror = () => article.classList.add("loaded");
        }
      } else if (!img) {
        article.classList.add("loaded");
      }
    }
    
    // Reflow.
    if (visibleImagePromises.length > 0) {
      await Promise.all(visibleImagePromises);
    }
    return fragment;
  }

  /**
   * Search shows by name or genre.
   * @param {number || string} showId - The show id.
   * @returns {void}
   */
  getSelectedEpisode(value) {
    this.dom.resetContainer();

    if (value === "all-episodes") {
      this.createEpisodesBySeasons(this.allEpisodes);
      const nbSeasons = this.episodeRender.getEpisodesBySeason(
        this.allEpisodes,
      );
      this.dom.setCount(this.dom.setPlurial(nbSeasons.size, "season"));
    }
    // Seasons.
    else if (value.charAt(0) === "S") {
      const seasonId = value.substring(1);
      const selectedEpisodes = this.allEpisodes.filter(
        (episode) => episode.season == seasonId,
      );
      // SlideShow
      const slides = new DocumentFragment();
      selectedEpisodes.forEach((s) => {
        slides.appendChild(this.episodeRender.createEpisodeElement(s));
      });
      const slideShow = new SlideShow(`${this.showId}-S${seasonId}`, this.container, slides)
      slideShow.init();
      const message = `Season ${seasonId}: displaying ${selectedEpisodes.length} episodes`;
      this.dom.setCount(message);
    } else {
      const selectedEpisode = this.allEpisodes.find(
        (episode) => episode.id == value,
      );
      if (selectedEpisode) {
        this.container.append(
          this.episodeRender.createEpisodeElement(selectedEpisode),
        );
        this.dom.resetCount();
      }
    }
  }
  /**
   * Search shows by name or genre.
   * @param {number || string} showId - The show id.
   * @returns {void}
   */
  searchEpisodes(value) {
    if (this.allEpisodes.length === 0) {
      return;
    }
    const searchTerm = value.toLowerCase();
    this.dom.resetContainer();
    const filteredEpisodes = this.allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary
        ? episode.summary.toLowerCase().includes(searchTerm)
        : false;
      return nameMatch || summaryMatch;
    });
    const lg = filteredEpisodes.length;
    if (lg === 0) {
      this.createEpisodesBySeasons(this.allEpisodes);
    } else {
      for (let episode of filteredEpisodes) {
        const article = this.episodeRender.createEpisodeElement(episode);
        this.container.append(article);
      }
    }

    const text =
      lg > 0 ? this.dom.setPlurial(lg, "episode") : `No result found`;
    this.dom.setCount(text);
  }
}
