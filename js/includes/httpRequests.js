export async function fetchData(id) {
  const base_url = "https://api.tvmaze.com/shows";
  const url = id ? `${base_url}/${id}/episodes` : base_url;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} – Failed to fetch the shows.`);
  }
  return await response.json();
}