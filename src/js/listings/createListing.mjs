// Import our custom CSS
// import { get } from 'cypress/types/lodash';
import "../../scss/styles.scss";

import { API_KEY, API_BASE, API_LISTINGS } from "../settings.mjs";
import { displayListings } from "./index.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { getProfileInfo } from "../shared/profileInfo.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";

/** @typedef {object} createListingRequest
 * @type {object}
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 * @property {object[]} media
 * @property {string} media.url
 * @property {string} media.alt
 * @property {string} endsAt
 */

/** @typedef {object} createListingResponse
 * @type {object}
 * @property {object} data
 * @property {string} data.id
 * @property {string} data.title
 * @property {string} data.description
 * @property {object[]} data.media
 * @property {string} data.media.url
 * @property {string} data.media.alt
 * @property {string[]} data.tags
 * @property {string} data.created
 * @property {string} data.updated
 * @property {string} data.endsAt
 * @property {object} data._count
 * @property {number} data._count.bids
 */

export function init() {
  // Ref: https://stackoverflow.com/a/9989458
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  /** @type {HTMLInputElement} */
  const endsAt = document.querySelector("#endsAt");
  endsAt.min = minDate;

  /** @type {HTMLFormElement} */
  const form = document.querySelector("#createListing");
  form.addEventListener("submit", handleSubmit);

  let area = document.querySelector("#listingText");
  area.addEventListener("input", showListingChar);

  const { avatarUrl, name } = getProfileInfo();

  if (name) {
    /** @type {HTMLImageElement} */
    const img = document.querySelector("#seller-image");
    img.src = avatarUrl;

    /** @type {HTMLHeadingElement} */
    const authorName = document.querySelector("#seller-name");
    authorName.innerText = name;
  }
}

/**
 * @description Shows or hides a info message.
 * @method statusMsg
 * @param {boolean} visible If true, shows the msg, otherwise hides it.
 * @param {string} [text] The message to show, or `undefined` if `visible` is false.
 */
export function statusMsg(visible, text) {
  /** @type {HTMLDivElement} */
  const status = document.querySelector("#statusMsg");

  if (visible === true) {
    status.style.display = "block";
    status.innerHTML = text;
  } else {
    status.style.display = "none";
  }
}

/**
 * @description Create a new user listing.
 * @async
 * @function createListing
 * @param {createListingRequest} listingData The listing properties to send to the API
 * @returns {Promise<createListingResponse|null|undefined>} If response is ok, return listings. If response is not ok, return null. Returns undefined for unexpected errors.
 */
async function createListing(listingData) {
  try {
    displaySpinner(true, "#spinnerCreateListing");
    displayError(false, "#errorCreateListing");

    const url = API_BASE + API_LISTINGS;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(listingData),
    });

    if (response.ok) {
      /** @type {createListingResponse} */
      const listing = await response.json();
      console.log("Create listing API", listing);

      return listing;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, "#errorCreateListing", msg);

    return null;
  } catch (ev) {
    displayError(true, "#errorCreateListing", "Something went wrong, try again!");
  } finally {
    displaySpinner(false, "#spinnerCreateListing");
  }
}

/**
 * @description Handle the form submit.
 * @method handleSubmit
 * @param {Event} ev
 */
async function handleSubmit(ev) {
  ev.preventDefault();

  displaySpinner(true, "#spinnerCreateListing");
  displayError(false, "#errorCreateListing");

  try {
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

    const listingTitle = form.elements["listingTitle"].value;
    const endsAt = form.elements["endsAt"].valueAsDate.toISOString();
    const listingText = form.elements["listingText"].value;
    const listingImageUrl1 = form.elements["listingImageUrl1"].value;
    const listingImageUrl2 = form.elements["listingImageUrl2"].value;
    const listingImageUrl3 = form.elements["listingImageUrl3"].value;

    const media = [];
    if (listingImageUrl1) {
      media.push({
        url: listingImageUrl1,
        alt: "",
      });
    }

    if (listingImageUrl2) {
      media.push({
        url: listingImageUrl2,
        alt: "",
      });
    }

    if (listingImageUrl3) {
      media.push({
        url: listingImageUrl3,
        alt: "",
      });
    }

    /** @type {createListingRequest} */
    const request = {
      title: listingTitle,
      endsAt: endsAt,
      description: listingText,
      tags: [],
      media: media,
    };

    const listing = await createListing(request);
    if (listing) {
      statusMsg(true, "Well done! You have created a new listing.");

      setTimeout(() => {
        statusMsg(false, "");
      }, 4000);

      form.reset();
      displayListings();
    }
  } catch (ev) {
    displayError(true, "#errorCreateListing", "Could not create a listing!");
  } finally {
    displaySpinner(false, "#spinnerCreateListing");
  }
}

/**
 * @description Show many characters remaining
 * @method showListingChar
 * @param {Event} ev
 */
function showListingChar(ev) {
  const textArea = /** @type {HTMLTextAreaElement} */ (ev.currentTarget);

  /**@type {HTMLSpanElement}*/
  let characters = document.querySelector("#char");

  let content = textArea.value;
  characters.textContent = `${content.length}/280`;

  content.trim();
  console.log(content);
}
