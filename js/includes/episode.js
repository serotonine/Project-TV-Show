import { fetchData } from "./httpRequests.js";
import { getDomEl, removeLoader } from "./dom.js";

const episodeCache = {};
const dom = getDomEl();

export async function getAllEpisodes(showId) {
  if (episodeCache[showId]) {
    // Return cached data.
    return episodeCache[showId];
  }
  try {
    const AllEpisodes = await fetchData(showId);
    // Store in cache.
    episodeCache[showId] = AllEpisodes;
    return AllEpisodes;
  } catch (error) {
    dom.errorElem.innerHTML = error.message;
  }
}

// Display all episodes with proper loading.
export async function makePageForEpisodes(episodes) {
  const { container } = dom;
  /* container.innerHTML = "";
  addLoader("episodes");  // ← Loader visible */

  const fragment = document.createDocumentFragment();
  const visibleImagePromises = [];

  // Création de toutes les cartes
  for (let episode of episodes) {
    const section = getEpisode(episode);
    fragment.appendChild(section);

    // On collecte les promesses seulement pour les images qui ont besoin d'être attendues
    const img = section.querySelector("img");
    if (img && !img.complete) {
      // On vérifie si la carte est dans la viewport (au moins partiellement)
      // Note : on force le reflow après ajout pour que getBoundingClientRect soit fiable
      const isVisible = () => {
        const rect = section.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      };

      if (isVisible()) {
        visibleImagePromises.push(
          new Promise((resolve) => {
            img.onload = () => {
              section.classList.add("loaded");
              resolve();
            };
            img.onerror = () => {
              section.classList.add("loaded");
              resolve();
            };
          })
        );
      } else {
        img.onload = img.onerror = () => section.classList.add("loaded");
      }
    } else if (!img) {
      section.classList.add("loaded");
    }
  }
  container.appendChild(fragment);

  void container.offsetHeight;

  if (visibleImagePromises.length > 0) {
    await Promise.all(visibleImagePromises);
  }
  removeLoader("episodes");
}
// Create DOM episode.
function getEpisode(episode) {
  const { id, url, name, season, number, image, summary } = episode;

  // Define.
  const section = document.createElement("section");
  const banner = document.createElement("div");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const body = document.createElement("div");

  // Set attributes.
  section.classList.add("episode");
  banner.classList.add("episode-banner");
  figure.classList.add("episode-figure");
  body.classList.add("episode-body");
  section.dataset.id = id;
  section.setAttribute("aria-label", name);

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
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-size">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>
</a></p>`;
  // Append.
  figure.appendChild(img);
  section.appendChild(banner);
  section.appendChild(figure);
  section.appendChild(body);
  // Handle Image.
  if (image?.medium) {
    img.src = image?.medium;
    img.alt = name;
    img.width = 250;
    img.height = 140;

    img.onload = () => {
      section.classList.add("loaded");
    };

    img.onerror = () => {
      // Avoid blocking.
      section.classList.add("loaded");
    };

    figure.appendChild(img);
  } else {
    // No image.
    section.classList.add("loaded");
  }

  return section;
}

export function populateEpisodeSelect(allEpisodes) {
  const { episodeSelect, searchInput } = dom;
  searchInput.innerHTML = "";
  for (let episode of allEpisodes) {
    const option = document.createElement("option");
    const episodeId = `S${("" + episode.season).padStart(2, "0")}E${(
      "" + episode.number
    ).padStart(2, "0")}`;
    option.value = episode.id;
    option.textContent = `${episodeId} - ${episode.name}`;
    episodeSelect.appendChild(option);
  }
}

export function getSelectedEpisode(value, allEpisodes) {
  const { container, episodeCount } = dom;
  container.innerHTML = "";

  if (value === "all-episodes") {
    for (let episode of allEpisodes) {
      container.append(getEpisode(episode));
    }
    episodeCount.textContent = `Displaying ${allEpisodes.length} episodes`;
  } else {
    const selectedEpisode = allEpisodes.find((episode) => episode.id == value);
    if (selectedEpisode) {
      container.append(getEpisode(selectedEpisode));
      episodeCount.textContent = "";
    }
  }
}

export function searchEpisodes(value, allEpisodes) {
  const { container, episodeCount } = dom;
  const searchTerm = value.toLowerCase();
  container.innerHTML = "";
  const filteredEpisodes = allEpisodes.filter((episode) => {
    const nameMatch = episode.name.toLowerCase().includes(searchTerm);
    const summaryMatch = episode.summary
      ? episode.summary.toLowerCase().includes(searchTerm)
      : false;
    return nameMatch || summaryMatch;
  });

  for (let episode of filteredEpisodes) {
    container.append(getEpisode(episode));
  }
  const lg = filteredEpisodes.length;
  episodeCount.textContent =
    lg > 0 ? `Displaying ${lg} episode${lg > 1 && "s"}` : `No result found`;
}
