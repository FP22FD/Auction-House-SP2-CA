import { updateListings } from "./index.mjs";
import { API_BASE, API_KEY, API_SEARCH } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";

/** @typedef GetAuctionListingsDataResponse
 * @type {object}
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {object[]} media
 * @property {string} media.url
 * @property {string} media.alt
 * @property {string[]} tags
 * @property {string} created
 * @property {string} updated
 * @property {string} endsAt
 * @property {object} seller
 * @property {string} seller.name
 * @property {string} seller.email
 * @property {null} seller.bio
 * @property {object} seller.avatar
 * @property {string} seller.avatar.url
 * @property {string} seller.avatar.alt
 * @property {object} seller.banner
 * @property {string} seller.banner.url
 * @property {string} seller.banner.alt
 * @property {object} _count
 * @property {number} _count.bids
 */

/** @typedef {object} GetAuctionListingsResponse
 * @property {GetAuctionListingsDataResponse[]} data
 */

let data = [];

export function init() {
  /** @type {HTMLButtonElement} */
  const btn = document.querySelector("#btn"); // button
  btn.addEventListener("click", handleSearch);
}

/**
 * @description Handle the button search click.
 * @method handleSearch
 * @param {Event} ev
 */
async function handleSearch(ev) {
  ev.preventDefault();

  displaySpinner(true, "#spinnerListings");
  displayError(false, "#errorSearch");

  try {
    /** @type {HTMLInputElement} */
    const txtFilter = document.querySelector("#filter");
    txtFilter.value = "";

    /** @type {HTMLInputElement} */
    const search = document.querySelector("#search"); //input

    const text = search.value;

    if (text !== "") {
      const results = await searchPosts(text);

      if (!results) {
        return;
      }
      updateListings(results, "");
    }
  } catch (ev) {
    displayError(true, "#errorSearch", "Could not show the listings!");
  } finally {
    displaySpinner(false, "#spinnerListings");
  }
}

/**
 * @description Returns all listings that does match the search text
 * @async
 * @function searchPosts
 * @param {string} text The string to search for
 * @return {Promise<Array<GetAuctionListingsDataResponse> |null | undefined>} Returns an array if the fetch is successful, otherwise it returns null for response not ok. It returns undefined for unexpected errors.
 * @example
 * // returns a Promise with an array of listings
 * const posts = await searchPosts("Travel");
 */
async function searchPosts(text) {
  try {
    displaySpinner(true, "#spinnerListings");
    displayError(false, "#errorSearch");

    const url = API_BASE + API_SEARCH + encodeURIComponent(text); // text

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      /** @type {GetAuctionListingsResponse} */
      const listingsData = await response.json();
      data = listingsData.data;

      return data;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, "#errorSearch", msg);

    return null;
  } catch (error) {
    displayError(true, "#errorSearch", "Could not show the listings!");
  } finally {
    displaySpinner(false, "#spinnerListings");
  }
}
