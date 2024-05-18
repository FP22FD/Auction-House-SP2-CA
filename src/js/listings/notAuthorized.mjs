export function init() {
  /** @type {HTMLDivElement} */
  const form = document.querySelector("#createListing");
  form.classList.add("d-none");

  /** @type {HTMLDivElement} */
  const logout = document.querySelector("#logout");
  logout.classList.add("d-none");

  /** @type {HTMLDivElement} */
  const profile = document.querySelector("#profile");
  profile.classList.add("d-none");
}
