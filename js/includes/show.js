import { fetchData } from "./httpRequests.js";

// Display shows.
export function makePageForShows(rootElem, allShowsRaw) {
  
  if (!Array.isArray(allShowsRaw) || !allShowsRaw.length) {
    throw new Error("Cannot display the shows. Check why.");
  }
  // Sort alphabetical.
  const allShows = alphabeticalSort(allShowsRaw);
  // Change grid minmax.
  rootElem.classList.toggle("shows-wrapper");
  rootElem.innerHTML = "";

  for (let show of allShows) {

    // article.
    const article = document.createElement("article");
    article.dataset.id = show.id;
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
    //status.

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
    rootElem.appendChild(article);
    
  }
}
export function populateShowSelect(showSelect, allShowsRaw) {
  const allShows = alphabeticalSort(allShowsRaw);
  for (let show of allShows) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  }
  showSelect.addEventListener("change", function (e) {
    const selectedShowId = e.target.value || 82;
    // Notice the search container.
    const customEvt = new CustomEvent("select-change", {
      bubbles: true,
      detail: { id: selectedShowId },
    });
    e.target.dispatchEvent(customEvt);
  });
}
export function searchShows(dom, value, allShows){
  const { searchContainer, episodeInput, container, episodeCount } = dom;
    const searchTerm = value.toLowerCase();
    container.innerHTML = "";
    const filteredShows = allShows.filter((show) => {
      const nameMatch = show.name.toLowerCase().includes(searchTerm);
      const genreMatch = show.genres.some((genre) => genre.toLowerCase() === searchTerm );
      return nameMatch || genreMatch;
    });
    makePageForShows(container, filteredShows);

    episodeCount.textContent =
      filteredShows.length > 0
        ? `Displaying ${filteredShows.length} episode(s)`
        : `No result found`;
}

// Sort alphabetical case insensitive function.
function alphabeticalSort(shows) {
  return shows.sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
}
