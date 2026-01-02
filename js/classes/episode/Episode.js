import { fetchData } from "../../includes/httpRequests.js";
import EpisodeRender from "./EpisodeRender.js";
import SlideShow from "../../includes/slideshow/SlideShow.js";

export default class Episode {
  constructor(dom) {
    this.dom = dom;
    this.episodeRender = new EpisodeRender(dom);
    this.episodeCache = {};
    this.allEpisodes = [];
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
    this.dom.addLoader("episodes");
    // Fetch episodes or retrieve from storage.
    this.allEpisodes = await this.getAllEpisodes(showId);
    this.dom.setTitle(title);
    await this.makePageForEpisodes(this.allEpisodes);
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
   * Display all episodes with proper loading.
   * @param {array} episodes - The episodes list.
   * @returns {Promise<void>}
   */
  async makePageForEpisodes(episodes) {
    const fragment = document.createDocumentFragment();
    const visibleImagePromises = [];

    // Create all episodes.
    for (let episode of episodes) {
      const article = await this.episodeRender.createEpisodeElement(episode);
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
            })
          );
        } else {
          img.onload = img.onerror = () => article.classList.add("loaded");
        }
      } else if (!img) {
        article.classList.add("loaded");
      }
    }
    this.container.appendChild(fragment);
    // Reflow.
    void this.container.offsetHeight;
    if (visibleImagePromises.length > 0) {
      await Promise.all(visibleImagePromises);
    }
    this.dom.removeLoader();
  }

  /**
   * Search shows by name or genre.
   * @param {number || string} showId - The show id.
   * @returns {void}
   */
  getSelectedEpisode(value, allEpisodes) {
    const { episodeCount } = this.dom.elements;
    this.dom.resetContainer();

    if (value === "all-episodes") {
      for (let episode of allEpisodes) {
        this.container.append(this.episodeRender.createEpisodeElement(episode));
      }
      this.dom.setCount(`Displaying ${allEpisodes.length} episodes`);
    } 
    // Seasons.
    else if (value.charAt(0) === "S") {
      const seasonId = value.substring(1);
      const selectedEpisodes = this.allEpisodes.filter(
        (episode) => episode.season == seasonId
      );
      // SlideShow
      const slides = new DocumentFragment();
      selectedEpisodes.forEach((s) => {
        slides.appendChild(this.episodeRender.createEpisodeElement(s));
      });
      const slideShow = new SlideShow(this.container, slides);
      slideShow.init();
      const message = `Season ${seasonId}: displaying ${selectedEpisodes.length} episodes`;
      this.dom.setCount(message);
    } else {
      const selectedEpisode = this.allEpisodes.find(
        (episode) => episode.id == value
      );
      if (selectedEpisode) {
        this.container.append(
          this.episodeRender.createEpisodeElement(selectedEpisode)
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
      this.makePageForEpisodes(this.allEpisodes);
    } else {
      for (let episode of filteredEpisodes) {
        const article = this.episodeRender.createEpisodeElement(episode);
        this.container.append(article);
      }
    }

    const text =
      lg > 0 ? dom.setPlurial(lg, "episode") : `No result found`;
    this.dom.setCount(text);
    
  }
}
