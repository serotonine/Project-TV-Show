export default class ShowSort{
  constructor(allShowsRaw){
    this.allShowsRaw = allShowsRaw;
  }
  /**
   * Sort the shows list by alphabetical order (case insensitive).
   * @param {Array} list - The list of shows to sort.
   * @returns {Array} - The sorted list.
   */
  alphabeticalSort(list) {
    return [...list].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  /**
     * Sort the shows list by premiered date.
     * @param {Array} list - The list of shows to sort.
     * @returns {Array} The sorted list.
     */
    startSort() {
      return [...this.allShowsRaw].sort((a, b) => {
        const dateA = a.premiered ? Date.parse(a?.premiered) : Infinity;
        const dateB = b.premiered ? Date.parse(b.premiered) : Infinity;
        return dateA - dateB;
      });
    }
}