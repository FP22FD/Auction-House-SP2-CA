// Import our custom CSS
// import { get } from 'cypress/types/lodash';
import "../../scss/styles.scss";

import {
  API_KEY,
  API_BASE,
  API_LISTINGS,
  API_GET_LISTINGS_PARAMS,
} from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";
import { sanitize } from "../shared/sanitize.mjs";
import { daysOfWeek } from "../shared/daysOfWeek.mjs";

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
 * @property {GetAuctionListingsDataResponse} item
 */

export function init() {
  // checkUserAuth();

  /** @type {HTMLInputElement} */
  const txtFilter = document.querySelector("#filter"); // input
  txtFilter.addEventListener("input", handleSearchInput);

  displayListings();
}

/** @type {Array<GetAuctionListingsDataResponse>} */
let data = [];

export async function displayListings() {
  try {
    displaySpinner(true, "#spinnerListings");
    displayError(false, "#errorListings");

    const url = API_BASE + API_LISTINGS + API_GET_LISTINGS_PARAMS;

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
      // console.log(data);

      updateListings(data, "");
      return data;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, "#errorListings", msg);

    return null;
  } catch (ev) {
    displayError(true, "#errorListings", "Could not show the listings!");
  } finally {
    displaySpinner(false, "#spinnerListings");
  }
}

/**
 * @description Display listings, filtered by searchInput.
 * @method updateListings
 * @param {Array<GetAuctionListingsDataResponse|undefined>} data Listings to be shown.
 * @param {string} searchInput The text to be found. If empty returns all listings.
 */
export async function updateListings(data, searchInput) {
  /** @type {HTMLDivElement} */
  const listings = document.querySelector("#listings");
  listings.innerHTML = "";

  if (data.length === 0) {
    listings.innerHTML = "No listings found!";
    return;
  }

  data
    .filter((listing) => {
      const searchText = searchInput.toLowerCase();
      const title = (listing.title || "").toLowerCase();
      const body = (listing.description || "").toLowerCase();

      if (title.includes(searchText) || body.includes(searchText)) {
        return true;
      }
      return false;
    })
    .map((x) => generateHtml(x))
    .forEach((x) => {
      listings.appendChild(x);
    });

  return;
}

/**
 * @description Map a listing to html content
 * @function generateHtml
 * @param {GetAuctionListingsDataResponse}  item The listing properties
 * @returns {Object} Return the object listing
 */
function generateHtml(item) {
  const { id, title, endsAt, seller, media, description, created } = item;

  /** @type {HTMLTemplateElement} */
  const template = document.querySelector("#listing");
  const listing = /** @type {HTMLDivElement} */ (
    template.content.cloneNode(true)
  );

  listing.querySelector("article").dataset.id = item.id;

  // listing.querySelector("#deadline").innerHTML = endsAt;
  const endsAtDate = new Date(endsAt);
  countDown(60 * 1000, endsAtDate, ({ distance, days, hours, minutes }) => {
    const deadline = document.querySelector(
      `article[data-id="${item.id}"] #deadline`,
    );
    if (distance > 0) {
      const dayOfWeek = daysOfWeek[endsAtDate.getDay()];
      deadline.innerHTML = `${days}d ${hours}h ${minutes}m left, ${dayOfWeek}`;
    } else {
      deadline.innerHTML = "EXPIRED";
    }
  });

  listing.querySelector("h5").innerText = seller.name; // + item.id

  /** @type {HTMLImageElement} */
  const sellerImg = listing.querySelector("#sellerImg");
  sellerImg.src = seller.avatar.url;

  let date = new Date(created);
  /** @type Intl.DateTimeFormatOptions */
  const options = {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // `BCP 47 language tag` => no-NO
  let dateString = date.toLocaleDateString("no-NO", options);
  listing.querySelector("#dateListing").innerHTML = dateString;

  listing.querySelector("#bodyTitle").innerHTML = sanitize(title);
  const textLimit = 120;
  const bodyText = listing.querySelector("#viewListing");
  let bodyTextSanitized = sanitize(description);

  // listing.querySelector("#bodyListing").innerHTML = sanitize(item.body);
  if (bodyTextSanitized.length > textLimit) {
    let htmlBody = bodyTextSanitized.substring(0, textLimit);
    htmlBody += `... <br><a href="./postdetails.html?id=${id}" class="link-offset-2 link-underline link-underline-opacity-0 blue-500 fw-bold">Read More<a/>`;
    bodyText.innerHTML = htmlBody;
  } else {
    bodyText.innerHTML = sanitize(description);
  }

  if (media) {
    const listingImgs = listing.querySelector("#listingImgs");

    /** @type {HTMLTemplateElement} */
    const templateCarousel = document.querySelector("#slider-carousel");
    const CloneCarousel = /** @type {HTMLDivElement} */ (
      templateCarousel.content.cloneNode(true)
    );

    const carouselNewId = `carousel_${item.id}`;
    CloneCarousel.querySelector(".carousel").id = carouselNewId;
    // console.log("New Id", carouselNewId);

    /** @type {HTMLButtonElement} */
    const prev = CloneCarousel.querySelector(".carousel-control-prev");
    prev.dataset.bsTarget = `#${carouselNewId}`;

    /** @type {HTMLButtonElement} */
    const next = CloneCarousel.querySelector(".carousel-control-next");
    next.dataset.bsTarget = `#${carouselNewId}`;

    const imgs = CloneCarousel.querySelector(".carousel-inner");
    imgs.innerHTML = "";

    for (let i = 0; i < media.length; i++) {
      const img = media[i];
      // console.log("listing images", img);

      imgs.innerHTML += `<div  class="carousel-item ${i === 0 ? "active" : ""}"><img src="${img.url}" class="d-block card-img" alt="${img.alt}"></div>`;
    }

    if (media.length <= 1) {
      prev.style.display = "none";
      next.style.display = "none";
    }

    listingImgs.appendChild(CloneCarousel);
  }

  return listing;
}

/**
 * @description Handle the search submit.
 * @method handleSearchInput
 * @param {*} ev
 */
async function handleSearchInput(ev) {
  const userInput = /** @type {HTMLInputElement} */ ev.currentTarget.value;
  updateListings(data, userInput);
}

// Ref: https://www.w3schools.com/howto/howto_js_countdown.asp
function countDown(intervalMs, date, callback) {
  const countDownDate = date.getTime();

  // Ref: How to tick immediately: https://stackoverflow.com/a/20706004
  setTimeout(() => {
    const now = new Date().getTime();
    const { distance, days, hours, minutes, seconds } = calcCountdown(
      now,
      countDownDate,
    );
    callback({ distance, days, hours, minutes, seconds });
  }, 0);

  const x = setInterval(function () {
    const now = new Date().getTime();

    const { distance, days, hours, minutes, seconds } = calcCountdown(
      now,
      countDownDate,
    );

    callback({ distance, days, hours, minutes, seconds });

    if (distance < 0) {
      clearInterval(x);
    }
  }, intervalMs);
}

// TODO: make unit test
function calcCountdown(start, end) {
  const distance = end - start;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    distance,
    days,
    hours,
    minutes,
    seconds,
  };
}
