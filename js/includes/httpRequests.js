export async function fetchData(id) {
  const base_url = "https://api.tvmaze.com/shows";
  const url = id ? `${base_url}/${id}/episodes` : base_url;
  /* 
  * No timeout or retry logic
  * A slow or hanging API call will stall the UI indefinitely.
  * Consider adding an `AbortController` with a timeout. 
  */
  const ctrl = new AbortController();
  const timeOut = setTimeout(() => ctrl.abort(), 8000);
  const response = await fetch(url, { signal: ctrl.signal });
  clearTimeout(timeOut);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} – Failed to fetch the shows.`);
  }
  return await response.json();
}
