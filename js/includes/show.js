import { getDomEl, isInViewport } from "./dom.js";
const dom = getDomEl();

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

  // On attend seulement les images des articles visibles à l'écran
  if (visibleImagePromises.length === 0) {
    return Promise.resolve(); // Rien à attendre → tout déjà chargé ou pas d'image
  }

  return Promise.all(visibleImagePromises);
}

// Create DOM Show.
function getShow(show){
  // article.
    const article = document.createElement("article");
    article.dataset.id = show.id;
    article.dataset.title = show.name;
    article.classList.add("show");
    article.setAttribute("tabindex", "0");

    // Figure.
    const figure = document.createElement("figure");
    figure.classList.add("show-image");

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
    content.classList.add("show-body");

    // Title.
    const title = document.createElement("h2");
    title.textContent = show.name;
    content.appendChild(title);

    // Summary.
    const summary = document.createElement("div");
    summary.classList.add("show-summary");
    summary.innerHTML = show.summary;
    content.appendChild(summary);

    // Genres.
    const genres = document.createElement("div");
    genres.classList.add("show-genres");
    show?.genres.forEach(
      (genre) =>
        (genres.innerHTML += `<button class="btn show-genre" type="text">${genre}</button>`)
    );
    content.appendChild(genres);

    // Start-end.
    const startEnd = document.createElement("p");
    genres.classList.add("show-start-end");
    startEnd.innerHTML = `<small><b>${show.premiered} | ${show.ended}</b></small>`;
    content.appendChild(startEnd);

    // rating.
    const rating = document.createElement("p");
    rating.classList.add("show-rating");
    const average = Math.round(show.rating.average);
    for (let i = 1; i <= 10; i++) {
      if (i <= average) {
        rating.innerHTML += `<span class="active">*</span>`;
      } else {
        rating.innerHTML += `<span>*</span>`;
      }
    }
    content.appendChild(rating);
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

// Sort alphabetical case insensitive function.
function alphabeticalSort(shows) {
  return shows.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
}

