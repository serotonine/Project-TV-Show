export default class Dom {
  constructor() {
    this.elements = this.domEl;
  }

  /**
   * Get all DOM elements needed.
   * @returns {Object} An object containing DOM elements.
   */
  get domEl() {
    return {
      title: document.querySelector(".page-title-current"),
      rootElem: document.getElementById("root"),
      container: document.getElementById("main-wrapper"),
      searchContainerWrapper: document.getElementById(
        "search-container-wrapper"
      ),
      searchContainer: document.getElementById("search-container"),
      genresContainer: document.getElementById("genres-container"),
      showSelect: document.getElementById("show-select"),
      episodeSelect: document.getElementById("episode-select"),
      displaySelect: document.getElementById("display-select"),
      searchInput: document.getElementById("search-input"),
      btnShowCta: document.getElementById("btn-show-cta"),
      errorElem: document.getElementById("error"),
      countElem: document.getElementById("search-count"),
      btnBackToTop: document.getElementById("back-to-top"),
    };
  }

  /**
   * Get the loader Element.
   * @returns {HTMLElement} The loader element.
   */
  get loader() {
    const loader = document.createElement("h3");
    loader.id = "loader";
    return loader;
  }

  /**
   * Appends the loader in the DOM.
   * @param {string} currentDisplay - "show" or "episode".
   * @returns {void}
   */
  addLoader(currentDisplay) {
    const { container } = this.elements;
    const loader = this.loader; // Utilisation du getter loader
    loader.textContent = `Loading ${currentDisplay}...`;
    container.appendChild(loader);
  }
  /**
   * Remove the loader from the DOM.
   * @returns {void}
   */
  removeLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.remove();
    }
  }
  /**
   * Empty the Shows/Episode container.
   * @returns {void}.
   */
  resetContainer() {
    this.elements.container.innerHTML = "";
  }
  /**
   * Empty the search input.
   * @returns {void}.
   */
  resetSearchInput() {
    this.elements.searchInput.value = "";
  }
  /**
   * Reset the selects to value:none.
   * @param {string} currentDisplay "show" || "episodes".
   * @returns {void}.
   */
  resetSelect(currentDisplay = null) {
    if (!currentDisplay) {
      // Reset all selects.
      this.elements.searchContainer
        .querySelectorAll("select")
        .forEach((s) => (s.selectedIndex = 0));
    } else {
      const { showSelect, episodeSelect } = this.elements;
      currentDisplay === "show"
        ? (showSelect.selectedIndex = 0)
        : (episodeSelect.selectedIndex = 0);
    }
  }
  /**
   * Remove class active from all genres buttons.
   * @returns {void}.
   */
  resetGenres() {
    const { genresContainer: container } = this.elements;
    const genres = container.children;
    for (const genre of genres) {
      genre.classList.remove("active");
    }
  }
  /**
   * Set the H1 title text.
   * @param {string} the title text.
   * @returns {void}.
   */
  setTitle(txt) {
    this.elements.title.textContent = txt;
  }
  /**
   * Set the "Display xx" paragraph text.
   * @param {string} the paragraph text.
   * @returns {void}.
   */
  setCount(txt) {
    this.elements.countElem.textContent = txt;
  }
  /**
   * Empty paragraph text.
   * @returns {void}.
   */
  resetCount() {
    this.elements.countElem.textContent = "";
  }

  /**
   * Set the Error paragraph text.
   * @param {string} the paragraph text.
   * @returns {void}.
   */
  setError(txt) {
    this.elements.errorElem.textContent = txt;
  }

  /**
   * Link blank icon.
   * @returns {string} A SVG string.
   */
  get SVGLink() {
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-size">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>`;
  }

  /**
   * Calculate if an element is visible.
   * @param {HTMLElement} element - The element to check.
   * @returns {boolean} True if the element is in the viewport, false otherwise.
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  /**
   * Handle back to top button visibility and click event.
   * @returns {void}
   */
  backToTop() {
    const { searchContainerWrapper, btnBackToTop } = this.elements; // Utilisation de this.elements
    const options = {
      root: null,
      rootMargin: "-100px 0px 0px 0px",
      threshold: 0,
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          btnBackToTop.classList.remove("hidden");
        } else {
          btnBackToTop.classList.add("hidden");
        }
      });
    }, options);

    if (searchContainerWrapper && btnBackToTop) {
      intersectionObserver.observe(searchContainerWrapper);

      btnBackToTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );
    }
  }

  /**
   * Handle inputs display helper.
   * @params {HTMLElements} list od HTMLElements
   */
toggleNone(...elements) {
  elements.forEach((el) =>
    el.closest(".search-field").classList.toggle("none")
  );
}
}
