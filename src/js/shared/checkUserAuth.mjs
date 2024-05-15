import { load } from "./storage.mjs";

/**
 * @description check if the user is logged, otherwise redirect to login page
 * @method checkUserAuth
 */
export function checkUserAuth() {
  // const checkAccessToken = localStorage.getItem("key");
  const checkAccessToken = load("token");

  if (!checkAccessToken) {
    window.location.href = "/";
  }
}
