// Import our custom CSS
// import { get } from 'cypress/types/lodash';
import "../../scss/styles.scss";

import { API_BASE, API_BID_ON_LISTING, API_KEY } from "../settings.mjs";
import { displayListings } from "./index.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";

/** @typedef {object} createBidRequest
/* @typed {object}
 * @property {number} amount
 */

/** @typedef  {object} createBidResponse
/* @typed {object}
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} tags
 * @property {object[]} media
 * @property {string} media.url
 * @property {string} media.alt
 * @property {string} created
 * @property {string} updated
 * @property {string} endsAt
 * @property {object} _count
 * @property {number} _count.bids
 */

// -------------------------------------------------

/**
 * @description Shows or hides a info message.
 * @method statusMsg
 * @param {string} listingId The listing id.
 * @param {boolean} visible If true, shows the msg, otherwise hides it.
 * @param {string} [text] The message to show, or `undefined` if `visible` is false.
 */
export function statusMsg(listingId, visible, text) {
  /** @type {HTMLDivElement} */
  const status = document.querySelector(`article[data-id="${listingId}"] #statusBidMsg`);

  if (visible === true) {
    status.classList.remove("d-none");
    status.classList.add("d-flex");
    status.innerHTML = text;
  } else {
    status.classList.remove("d-flex");
    status.classList.add("d-none");
  }
}

/**
 * @description Shows or hides a info error message.
 * @method displayError
 * @param {string} listingId The error id.
 * @param {boolean} visible If true, shows the msg, otherwise hides it.
 * @param {string} [text] The message to show, or `undefined` if `visible` is false.
 */
export function displayError(listingId, visible, text) {
  /** @type {HTMLDivElement} */
  const status = document.querySelector(`article[data-id="${listingId}"] #errorBidMsg`);

  if (visible === true) {
    status.classList.remove("d-none");
    status.classList.add("d-flex");
    status.innerHTML = text;
  } else {
    status.classList.remove("d-flex");
    status.classList.add("d-none");
  }
}

/**
 * @description Show and hide the spinner element
 * @method displaySpinner
 * @param {string} listingId The listing id.
 * @param {boolean} spinnerVisible If true, shows the spinner, otherwise hides it.
 */
export function displaySpinner(listingId, spinnerVisible) {
  const spinner = document.querySelector(`article[data-id="${listingId}"] #spinnerBid`); //es: #spinnerListings, and others

  if (!spinner) {
    return;
  }

  if (spinnerVisible === true) {
    spinner.classList.remove("d-none");
    spinner.classList.add("d-flex");
  } else {
    spinner.classList.remove("d-flex");
    spinner.classList.add("d-none");
  }
}

/**
 * @description Create a new bid on listing.
 * @async
 * @function createBid
 * @param {number} amount The bid amount
 * @param {string} listingId The bid amount
 * @returns {Promise<createBidResponse|null|undefined>} If response is ok, return listings. If response is not ok, return null. Returns undefined for unexpected errors.
 */
async function createBid(listingId, amount) {
  try {
    displaySpinner(listingId, true);
    displayError(listingId, false);

    const url = API_BASE + API_BID_ON_LISTING(listingId);

    /** @type {createBidRequest} */
    const request = {
      amount: amount,
    };

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(request),
    });

    if (response.ok) {
      /** @type {createBidResponse} */
      const bid = await response.json();

      return bid;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(listingId, true, msg);

    return null;
  } catch (ev) {
    displayError(listingId, true, "Something went wrong, try again!");
  } finally {
    displaySpinner(listingId, false);
  }
}

/**
 * @description Handle the form bid submit.
 * @method handleBidSubmit
 * @param {string} listingId The bid amount
 * @param {Event} ev
 */
export async function handleBidSubmit(listingId, ev) {
  displayError(listingId, false, "");

  try {
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

    /** @type {HTMLInputElement} */
    const txtAmount = form.elements["amountBid"];

    const amount = txtAmount.valueAsNumber;

    const bid = await createBid(listingId, amount);

    if (bid) {
      statusMsg(listingId, true, "Well done! You have created a new bid.");

      setTimeout(() => {
        statusMsg(listingId, false, "");

        form.reset();
        displayListings();
      }, 4000);
    }
  } catch (ev) {
    displayError(listingId, true, "Could not create a bid!");
  }
}
