import { getDomEl, isInViewport, getSVGLink } from "./dom.js";
import { Favorites } from "./favorites.js";

const dom = getDomEl();
const {container} = dom;

// Display Shows.
export function makePageForShows(allShowsRaw) {
  if (!Array.isArray(allShowsRaw) || !allShowsRaw.length) {
    dom.errorElem.innerHTML = "Cannot display the shows. Check why.";
    return Promise.resolve();
  }
  const {container} = dom;
  
  // Sort alphabetical.
  const allShows = alphabeticalSort(allShowsRaw);
  // Change grid minmax.
  container.classList.toggle("shows-wrapper");
  // Store all articles.
  const fragment = document.createDocumentFragment();
  const visibleImagePromises = [];
  
  for (let show of allShows) {
    fragment.appendChild(getShow(show));
  }
  container.appendChild(fragment);
  // Force reflow.
  void container.offsetHeight;
  // Find articles in viewport.
  const articles = container.querySelectorAll(".show");

  articles.forEach(article => {
    const img = article.querySelector("img");
    if (!img) return;

    // Cached.
    if (img.complete && img.naturalHeight !== 0) {
      return;
    }

    // Is in viewport ?
    if (isInViewport(article)) {
      visibleImagePromises.push(
        new Promise(resolve => {
          img.onload = () => {
            resolve();
          };
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
// Display Sorted Shows.
export function makePageForSortedShows(sortedShows) {
  container.innerHTML ="";
  // Store all articles.
  const fragment = document.createDocumentFragment();
  
  for (let show of sortedShows) {
    const current = getShow(show);
    current.classList.add("loaded");
    fragment.appendChild(current);
  }
  container.appendChild(fragment);
}


// Create DOM Show.
function getShow(show){
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
    summary.className = "show-summary";
    summary.innerHTML = show.summary;
    content.appendChild(summary);

    // Genres.
    const genres = document.createElement("div");
    genres.className = "show-genres";
    show?.genres.forEach(
      (genre) =>
        (genres.innerHTML += `<button class="btn show-genre" type="text">${genre}</button>`)
    );
    content.appendChild(genres);

    // Start-end.
    const startEnd = document.createElement("p");
    genres.className = "show-start-end";
    startEnd.innerHTML = `<small><b>${show.premiered} | ${show.ended}</b></small>`;
    content.appendChild(startEnd);

    // rating.
    const rating = document.createElement("p");
    rating.className = "show-rating";
    const average = Math.round(show.rating.average || 0);
    rating.innerHTML = `<span class="active">&#x2605;</span>`.repeat(average) + `<span>&#x2605;</span>`.repeat(10 - average);

    // Link to Official Website.
    const link = document.createElement("a");
    link.href = show.officialSite;
    link.alt = show.name;
    link.target = "_blank";
    link.innerHTML = ` <span>Official Site</span>
    ${getSVGLink()}`

    // Favorite.
    const favorite = document.createElement("div");
    favorite.className="heart";
    if (Favorites.isFavorite(show.id)){
      favorite.classList.add("active");
    }
    content.appendChild(rating);
    content.appendChild(link);
    content.appendChild(favorite);
    article.appendChild(content);
    return article;
}
// Add class "loaded" to set opacity:1.
export function displayPageForShows(){
  const articles = dom.container.querySelectorAll(".show");
  articles.forEach(article => {
    article.classList.add("loaded");
  });
}
// Genres.
export function populateGenres(allShows){
  const allGenres = new Set();
  for (let show of allShows) {
    const {genres} = show;
    genres.forEach(g=> allGenres.add(g));
  }
  allGenres.forEach(g => dom.genresContainer.appendChild(getGenre(g)));
}
function getGenre(genre){
  const btn = document.createElement("button");
  btn.type = "text";
  btn.className = "btn btn-genre";
  btn.dataset.name = genre;
  btn.textContent = genre;
  return btn; 
}
export async function searchShowsByGenres(allGenreActive, allShows){
  const actives = Array.from(allGenreActive).map(node=> node.dataset.name);
  const filteredShows = allShows.filter(show => actives.every(genre => show.genres.includes(genre)) ) ;
  let message = "";
  const lg = filteredShows.length;
  if (lg > 0) {
    await makePageForShows(filteredShows);
    displayPageForShows();
    message = `Displaying ${lg} Show${lg > 1 ? "s" : ""}.`;
  } else {
    message = `No Show found.`;
  }
  dom.episodeCount.textContent = message;
}
// Select.
export function populateShowSelect(allShowsRaw) {
  const allShows = alphabeticalSort(allShowsRaw);
  for (let show of allShows) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    dom.showSelect.appendChild(option);
  }
}
export async function searchShows(value, allShows) {
  const { container, episodeCount } = dom;
  const searchTerm = value.toLowerCase();
  container.innerHTML = "";
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
    await makePageForShows(filteredShows);
    displayPageForShows();
    message = `Displaying ${lg} Show${lg > 1 ? "s" : ""}.`;
  } else {
    message = `No Show found.`;
  }
  episodeCount.textContent = message;
}
export function sortPageForShows(value, allShowsRaw){
  let sortedShows;
  switch(value){
    case "name":
      // Sort alphabetical.
      sortedShows = alphabeticalSort(allShowsRaw);
      break;
      case "start":
      // Sort by start date.
      sortedShows = startSort(allShowsRaw);
        break;
      case "favorites":
      // Sort by favorites.
      sortedShows = favoriteSort(allShowsRaw);
        break;
  }
  makePageForSortedShows(sortedShows);
  return sortedShows.length;
}

// Sort alphabetical case insensitive function.
function alphabeticalSort(shows) {
return shows.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
}
// Sort shows by Premiered.
function startSort(shows) {
  return shows.sort((a, b) => {
    const atm = Date.parse(a.premiered);
    const btm = Date.parse(b.premiered);
    if(isNaN(atm) || isNaN(btm)){
      throw new Error("Show.js : Invalid premiered values.");
    }
    return atm - btm;
  });
}

// Sort by favorites.
function favoriteSort(allShowsRaw){
 const favorites = Favorites.getFavorites();
 return alphabeticalSort(favorites);
}


