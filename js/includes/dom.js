let loader;
// Retrieve all DOM Elements.
export function getDomEl() {
  return {
    title: document.querySelector(".page-title-current"),
    rootElem: document.getElementById("root"),
    container: document.getElementById("main-wrapper"),
    searchContainerWrapper: document.getElementById("search-container-wrapper"),
    searchContainer: document.getElementById("search-container"),
    genresContainer: document.getElementById("genres-container"),
    showSelect: document.getElementById("show-select"),
    episodeSelect: document.getElementById("episode-select"),
    displaySelect : document.getElementById("display-select"),
    episodeCount: document.getElementById("search-count"),
    searchInput: document.getElementById("search-input"),
    btnShowCta: document.getElementById("btn-show-cta"),
    btnBackToTop: document.getElementById("back-to-top"),
    errorElem: document.getElementById("error"),
  };
}
export function setLoader() {
  loader = document.createElement("h3");
  loader.id = "loader";
}
export function addLoader(currentDisplay) {
  const { container } = getDomEl();
  loader.textContent = `Loading ${currentDisplay}...`;
  container.appendChild(loader);
}
export function removeLoader() {
  loader.remove();
}

// Viewport.
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
}

// Back to top.
export function backToTop() {
  const { searchContainerWrapper, btnBackToTop } = getDomEl();
  // IntersectionObserver options
  const options = {
    root: null,
    rootMargin: "-100px 0px 0px 0px",
    threshold: 0,
  };
  // IntersectionObserver.
  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        btnBackToTop.classList.remove("hidden");
      } else {
        btnBackToTop.classList.add("hidden");
      }
    });
  }, options);
  intersectionObserver.observe(searchContainerWrapper);

  btnBackToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}
export function getSVGLink(){
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-size">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>`;
}