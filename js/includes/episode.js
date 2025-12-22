import { fetchData } from "./httpRequests.js";

const episodeCache = {};

export async function getAllEpisodes(showId) {
  if (episodeCache[showId]) {
    console.log("cache response", episodeCache[showId]);
    return episodeCache[showId]; // return cached data
  }
  try {
    const AllEpisodes = await fetchData(showId);
    episodeCache[showId] = AllEpisodes; // store in cache
    return AllEpisodes;
  } catch (error) {
    console.log("error");
  }
}
// Display all episodes.
export function makePageForEpisodes(dom, episodes) {
  const { container, searchInput, episodeSelect } = dom;
  container.innerHTML = "";
  // Change grid minmax.
  container.classList.toggle("episodes-wrapper");
  // Remove hidden class from search input and select label.
  searchInput.classList.remove("hidden");
 /*  const episodeSelectLabel = document.querySelector(
    'label[for="episode-select"]'
  );
  episodeSelect.classList.remove("hidden"); */

  // Populate episode-wrapper with all episodes.
  for (let episode of episodes) {
    container.append(getEpisode(episode));
  }
}

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
  img.src = image?.medium;
  img.alt = name;
  img.setAttribute("width", 250);
  img.setAttribute("height", 140);
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

  return section;
}

export function populateEpisodeSelect(dom, allEpisodes) {
  const {
    container,
    searchContainer,
    episodeSelect,
    searchInput,
    episodeCount,
  } = dom;
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
 /*  // Handle Search input event.
  searchContainer.addEventListener("input-search", function () {
    episodeSelect.selectedIndex = 0;
  }); */

  // Handle select event.
  episodeSelect.addEventListener("change", function () {
    const selectedValue = this.value;
    container.innerHTML = "";
    searchInput.innerHTML="";

    if (selectedValue === "all-episodes") {
      for (let episode of allEpisodes) {
        container.append(getEpisode(episode));
      }
      episodeCount.textContent = `Displaying ${allEpisodes.length} episode(s)`;
    } else {
      const selectedEpisode = allEpisodes.find(
        (episode) => episode.id == selectedValue
      );
      if (selectedEpisode) {
        container.append(getEpisode(selectedEpisode));
        episodeCount.textContent = `Displaying 1 episode(s)`;
      }
    }
  });
}

export function searchEpisodes(dom, value, allEpisodes) {
  const {container, episodeCount } = dom;
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
  episodeCount.textContent =
    filteredEpisodes.length > 0
      ? `Displaying ${filteredEpisodes.length} episode(s)`
      : `No result found`;
}
