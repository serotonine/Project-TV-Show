let loader;
// Retrieve all DOM Elements.
export function getDomEl() {
  return {
    title: document.querySelector(".page-title-current"),
    rootElem: document.getElementById("root"),
    container: document.getElementById("main-wrapper"),
    searchContainerWrapper: document.getElementById("search-container-wrapper"),
    searchContainer: document.getElementById("search-container"),
    showSelect: document.getElementById("show-select"),
    episodeSelect: document.getElementById("episode-select"),
    episodeCount: document.getElementById("search-count"),
    searchInput: document.getElementById("search-input"),
    btnShowCta: document.getElementById("btn-show-cta"),
    errorElem:document.getElementById("error"),
  };
}
export function setLoader(){
  loader = document.createElement("h3");
  loader.id="loader";
}
export function addLoader(currentDisplay){
  const {container} = getDomEl();
  loader.textContent = `Loading ${currentDisplay}...`;
  container.appendChild(loader);
}
export function removeLoader(){
  loader.remove();
}

// Viewport.
function getViewPort(){
  return {
    w: window.innerWidth,
    h: window.innerHeight
  }
}
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const {w,h} = getViewPort();

  return (
    rect.top < h && 
    rect.bottom > 0 &&
    rect.left < w &&
    rect.right > 0
  );
}