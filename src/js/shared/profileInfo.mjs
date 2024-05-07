import { load } from "./storage.mjs";

/** @typedef {object} ProfileInfo
 * @property {string} name
 * @property {string} bio
 * @property {string} avatarUrl
 */

/**
 * @description It returns the profile information from local storage.
 * @function getProfileInfo
 * @returns {ProfileInfo} Returns the profile info.
 */
export function getProfileInfo() {
  const profile = load("profile");
  const name = profile.name;
  const bio = profile.bio;
  const avatarUrl = profile.avatar.url;

  const result = {
    name,
    bio,
    avatarUrl,
  };

  return result;
}
