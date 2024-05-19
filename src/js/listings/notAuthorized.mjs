export function init() {
  /** @type {HTMLDivElement} */
  const createListing = document.querySelector("#createListing");
  createListing.classList.add("d-none");

  /** @type {HTMLDivElement} */
  const noAuthBanner = document.querySelector("#noAuthBanner");
  noAuthBanner.classList.remove("d-none");

  /** @type {HTMLDivElement} */
  const logout = document.querySelector("#logout");
  logout.classList.add("d-none");

  /** @type {HTMLDivElement} */
  const profile = document.querySelector("#profile");
  profile.classList.add("d-none");
}
