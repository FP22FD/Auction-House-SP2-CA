// Import our custom CSS
// import { get } from 'cypress/types/lodash';
import "../../scss/styles.scss";

import { API_BASE, API_LISTINGS, API_GET_LISTINGS_PARAMS } from "../settings.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";
import { sanitize } from "../shared/sanitize.mjs";
import { handleBidSubmit } from "./bidOnListing.mjs";
import { load } from "../shared/storage.mjs";

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
 * @property {object[]} bids
 * @property {string} bids.id
 * @property {number} bids.amount
 * @property {object} bids.bidder
 * @property {string} bids.bidder.name
 * @property {string} bids.bidder.email
 * @property {string} bids.bidder.bio
 * @property {object} bids.bidder.avatar
 * @property {string} bids.bidder.avatar.url
 * @property {string} bids.bidder.avatar.alt
 * @property {object} bids.bidder.banner
 * @property {string} bids.bidder.banner.url
 * @property {string} bids.bidder.banner.alt
 * @property {string} bids.created
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

    //This endpoint does not require authentication.
    const url = API_BASE + API_LISTINGS + API_GET_LISTINGS_PARAMS;

    const response = await fetch(url, {
      headers: {
        //   Authorization: `Bearer ${load("token")}`,
        //   "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      /** @type {GetAuctionListingsResponse} */
      const listingsData = await response.json();
      data = listingsData.data;

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
      return listing.media.length > 0;
    })
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
  const { title, endsAt, seller, media, description, created } = item;

  //An unregistered user may view through Listings
  const isAuth = !!load("token");

  /** @type {HTMLTemplateElement} */
  const template = document.querySelector("#listing");
  const listing = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

  listing.querySelector("article").dataset.id = item.id;

  /** @type Intl.DateTimeFormatOptions */
  const options = {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // listing.querySelector("#deadline").innerHTML = endsAt;
  const endsAtDate = new Date(endsAt);
  if (endsAtDate > new Date()) {
    let endsAtDateString = endsAtDate.toLocaleDateString("no-NO", options);
    listing.querySelector("#deadline").innerHTML = `Expires ${endsAtDateString}`;
  } else {
    listing.querySelector("#deadline").innerHTML = "EXPIRED";
  }

  listing.querySelector("h5").innerText = seller.name; // + item.id

  /** @type {HTMLImageElement} */
  const sellerImg = listing.querySelector("#sellerImg");
  sellerImg.src = seller.avatar.url;

  let date = new Date(created);

  // `BCP 47 language tag` => no-NO
  let dateString = date.toLocaleDateString("no-NO", options);
  listing.querySelector("#dateListing").innerHTML = dateString;

  listing.querySelector("#bodyTitle").innerHTML = sanitize(title);
  const textLimit = 50;
  const bodyText = listing.querySelector("#viewListing");
  let bodyTextSanitized = sanitize(description);

  // listing.querySelector("#bodyListing").innerHTML = sanitize(item.body);
  if (bodyTextSanitized.length > textLimit) {
    let htmlBody = bodyTextSanitized.substring(0, textLimit);
    bodyText.innerHTML = htmlBody;
  } else {
    bodyText.innerHTML = sanitize(description);
  }

  const history = listing.querySelector("#history");
  const hasBids = item.bids.length > 0;
  if (!hasBids || !isAuth) {
    history.classList.add("d-none");
  }

  //The entry point code for bid on listing
  if (isAuth) {
    if (hasBids) {
      const bids = item.bids.sort((v1, v2) => new Date(v2.created).valueOf() - new Date(v1.created).valueOf());
      const maxBid = bids[0].amount;

      /** @type {HTMLInputElement} */
      const amountBid = listing.querySelector("#amountBid");
      amountBid.min = String(maxBid + 0.01);

      const bidsHtml = bids.map((bid) => {
        const date = new Date(bid.created).toLocaleDateString("no-NO", options);
        return `<dt class="col-3"><span><i class="bi bi-gem"></i></span> ${bid.amount}</dt><dd class="col-9">${date} by ${bid.bidder.name}</dd>`;
      });
      history.querySelector("dl").innerHTML = bidsHtml.join("");
    }

    listing.querySelector(`#btnPlaceBid`).classList.remove("d-none");

    listing.querySelector(`#btnPlaceBid`).addEventListener("click", (ev) => {
      ev.preventDefault();

      const placeBid = document.querySelector(`article[data-id="${item.id}"] #btnPlaceBid`);
      placeBid.classList.add("d-none");

      const PlaceOnListing = document.querySelector(`article[data-id="${item.id}"] #PlaceOnListing`);
      PlaceOnListing.classList.remove("d-none");
      PlaceOnListing.classList.add("d-flex");
    });

    listing.querySelector("#createBid").addEventListener("submit", async (ev) => {
      ev.preventDefault();

      console.log(item.id);

      handleBidSubmit(item.id, ev);
    });
  } else {
    listing.querySelector(`#linkPlaceBid`).classList.remove("d-none");
  }

  if (media) {
    const listingImgs = listing.querySelector("#listingImgs");

    /** @type {HTMLTemplateElement} */
    const templateCarousel = document.querySelector("#slider-carousel");
    const CloneCarousel = /** @type {HTMLDivElement} */ (templateCarousel.content.cloneNode(true));

    const carouselNewId = `carousel_${item.id}`;
    CloneCarousel.querySelector(".carousel").id = carouselNewId;

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
