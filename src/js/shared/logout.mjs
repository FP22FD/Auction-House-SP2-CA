import { APP_GITHUB_PAGES_REPO } from "../settings.mjs";

export function init() {
  // const logoutBtn = document.querySelector("#logout").addEventListener("click", addEventToLogoutBtn);

  const logoutBtn = document.querySelector("#logout");
  logoutBtn.addEventListener("click", addEventToLogoutBtn);
}

async function addEventToLogoutBtn() {
  localStorage.clear();

  window.location.href = `/${APP_GITHUB_PAGES_REPO}/`;
}
