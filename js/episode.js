function getDomEl() {
  return {
    rootElem: document.getElementById("root"),
    container: document.querySelector(".episodes-wrapper"),
    searchContainer: document.getElementById("search-container"),
    searchInput: document.getElementById("search-input"),
    selectInput: document.getElementById("episode-select"),
    episodeCount: document.getElementById("search-count"),
  };
}

export async function getAllEpisodes() {
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} – Failed to fetch the episodes.`);
  }
  return await response.json();
}

export function getEpisode(episode) {
  const {
    id,
    url,
    name,
    season,
    number,
    airdate,
    airtime,
    airstamp,
    runtime,
    image: { medium },
    summary,
    _links: {
      self: { href },
    },
  } = episode;

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
  img.src = medium;
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
    <a href=${url} alt=${episodeId} target="_blank"><span>Watch on Maze</span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-size">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>
</a>
    </p>`;

  // Appends.
  figure.appendChild(img);
  section.appendChild(banner);
  section.appendChild(figure);
  section.appendChild(body);

  return section;
}

export function searchEpisodes(allEpisodes) {
  const { searchContainer, searchInput, container, episodeCount } = getDomEl();

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
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

    episodeCount.textContent = `Displaying ${filteredEpisodes.length} episode(s)`;
    // Notice the select.
    searchInput.dispatchEvent(
      new CustomEvent("input-search", { bubbles: true })
    );
  });
  // Listen to input event.
  searchContainer.addEventListener("select-search", function () {
    searchInput.value = "";
  });
}

export function populateEpisodeSelect(allEpisodes) {
  const { rootElem, container, searchContainer, selectInput, episodeCount } =
    getDomEl();

  for (let episode of allEpisodes) {
    const option = document.createElement("option");
    const episodeId = `S${("" + episode.season).padStart(2, "0")}E${(
      "" + episode.number
    ).padStart(2, "0")}`;
    option.value = episode.id;
    option.textContent = `${episodeId} - ${episode.name}`;
    selectInput.appendChild(option);
  }
  // Listen to input event.
  searchContainer.addEventListener("input-search", function () {
    selectInput.selectedIndex = 0;
  });

  selectInput.addEventListener("change", function () {
    const selectedValue = selectInput.value;
    container.innerHTML = "";

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
    // Notice the select.
    selectInput.dispatchEvent(
      new CustomEvent("select-search", { bubbles: true })
    );
  });
}
