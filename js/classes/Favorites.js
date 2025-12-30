export default class Favorites {
  constructor() {}
  // Get localStorage.
  static getFavorites() {
    return JSON.parse(localStorage.getItem("shows")) || [];
  }
  // Add or remove show from localStorage.
  static handleFavorites(id, shows) {
    const localFavorites = this.getFavorites();
    let updatedFavorites;
    // Check if the show is already in local storage.
    if (!this.isFavorite(id)) {
      // Not in local storage: add it.
      const currentFavorite = shows.find((item) => item.id == id);
      if (!currentFavorite) {
        throw new Error("handleFavorites: Show not found.");
      }
      updatedFavorites = [...localFavorites, currentFavorite];
    } else {
      // In local storage: remove it.
      updatedFavorites = localFavorites.filter((show) => show.id != id);
    }
    localStorage.setItem("shows", JSON.stringify(updatedFavorites));
  }

  static isFavorite(id) {
    const favorites = this.getFavorites();
    const _isFavorite = favorites.findIndex((show) => show.id == id);
    return _isFavorite !== -1;
  }
}
