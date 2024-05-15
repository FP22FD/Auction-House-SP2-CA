// Import our custom CSS
import "../../scss/styles.scss";

// Import all of Bootstrap's JS
// eslint-disable-next-line no-unused-vars
import * as bootstrap from "bootstrap";

import {
  API_BASE,
  API_KEY,
  API_LISTINGS_PROFILE,
  API_GET_LISTINGS_PARAMS,
  API_DATA_PROFILE,
  API_BIDS_PROFILE,
} from "../settings.mjs";
import { load, save } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { sanitize } from "../shared/sanitize.mjs";
import { getProfileInfo } from "../shared/profileInfo.mjs";
import { checkUserAuth } from "../shared/checkUserAuth.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";
import { countDown } from "../shared/calcCountdown.mjs";
import { daysOfWeek } from "../shared/daysOfWeek.mjs";

/** @typedef {object} GetProfileListingDataResponse
// @type {object} 
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
 * @property {string} seller.bio
 * @property {object} seller.avatar
 * @property {string} seller.avatar.url
 * @property {string} seller.avatar.alt
 * @property {object} seller.banner
 * @property {string} seller.banner.url
 * @property {string} seller.banner.alt
 * @property {object} _count
 * @property {number} _count.bids
 */

/** @typedef  GetProfileListingMetaResponse
// @type {object} 
 * @property {boolean} isFirstPage
 * @property {boolean} isLastPage
 * @property {number} currentPage
 * @property {null} previousPage
 * @property {null} nextPage
 * @property {number} pageCount
 * @property {number} totalCount
 */

/** @typedef {object} GetProfileListingsResponse
 * @property {Array<GetProfileListingDataResponse>} data
 * @property {GetProfileListingMetaResponse} meta
 */

// -------------------------------------------------

/** @type {Array<GetProfileListingDataResponse>} */
let dataProfile = [];

/** @type {Array<GetProfileBidsDataResponse>} */
let bidsProfile = [];

// --------------------------------------------------

/** @typedef {object} GetProfileDataResponse
// @type {object}
 * @property {string} name
 * @property {string} email
 * @property {string} bio
 * @property {object} avatar
 * @property {string} avatar.url
 * @property {string} avatar.alt
 * @property {object} banner
 * @property {string} banner.url
 * @property {string} banner.alt
 * @property {number} credits
 * @property {object} _count
 * @property {number} _count.listings
 * @property {number} _count.wins
 */

/** @typedef {object} GetProfileMetaResponse
 * @type {object}
 * @property {boolean} isFirstPage
 * @property {boolean} isLastPage
 * @property {number} currentPage
 * @property {null} previousPage
 * @property {null} nextPage
 * @property {number} pageCount
 * @property {number} totalCount
 */

/** @typedef {object} GetProfileResponse
 * @property {GetProfileDataResponse} data
 * @property {GetProfileMetaResponse} meta
 */

// --------------------------------------------------

/** @typedef {object} GetProfileDataResponse2
 *  @type {object}
 * @property {string} name
 * @property {string} email
 * @property {string} bio
 * @property {object} avatar
 * @property {string} avatar.url
 * @property {string} avatar.alt
 * @property {object} banner
 * @property {string} banner.url
 * @property {string} banner.alt
 * @property {number} credits
 * @property {object} _count
 * @property {number} _count.listings
 * @property {number} _count.wins
 */

/** @typedef {object} GetProfileMetaResponse2
 * @type {object}
 */

/** @typedef {object} GetProfileResponse2
 * @property {GetProfileDataResponse2} data
 * @property {GetProfileMetaResponse2} meta
 */

// --------------------------------------------------

/** @typedef {object} GetProfileBidsDataResponse
/* @type {object}
 * @property {string} id
 * @property {number} amount
 * @property {object} bidder
 * @property {string} bidder.name
 * @property {string} bidder.email
 * @property {null} bidder.bio
 * @property {object} bidder.avatar
 * @property {string} bidder.avatar.url
 * @property {string} bidder.avatar.alt
 * @property {object} bidder.banner
 * @property {string} bidder.banner.url
 * @property {string} bidder.banner.alt
 * @property {string} created
 * @property {object} listing
 * @property {string} listing.id
 * @property {string} listing.title
 * @property {string} listing.description
 * @property {string} listing.created
 * @property {string} listing.updated
 * @property {string} listing.endsAt
 * @property {string[]} listings.tags
 */

/** @typedef  GetProfileBidsMetaResponse
/* @type {object}
 * @property {boolean} isFirstPage
 * @property {boolean} isLastPage
 * @property {number} currentPage
 * @property {null} previousPage
 * @property {null} nextPage
 * @property {number} pageCount
 * @property {number} totalCount
 */

/** @typedef {object} GetProfileBidsResponse
 * @property {Array<GetProfileBidsDataResponse>} data
 * @property {GetProfileBidsMetaResponse} meta
 */
// --------------------------------------------------

/** @type {string} */
let name;

export function init() {
  checkUserAuth();
  addEventToEditProfile();

  const { avatarUrl, name: username, bio } = getProfileInfo();

  if (username) {
    name = username;

    updateProfile(avatarUrl, username, bio);

    // /** @type {HTMLImageElement} */
    // const img = document.querySelector("#author-image");
    // img.src = avatarUrl;

    // /** @type {HTMLHeadingElement} */
    // const authorInfoName = document.querySelector("#author-info h2");
    // authorInfoName.innerText = username;

    // /** @type {HTMLParagraphElement} */
    // const authorInfoBio = document.querySelector("#author-info p");
    // authorInfoBio.innerHTML = bio;

    displayListings(username);

    displayBids(username);

    fetchUserMetaData(username);
    // fetchUpdateProfile(username, avatarUrl);
  }

  /** @type {HTMLSelectElement} */
  const tabSortListings = document.querySelector("#order-By-Listings");
  tabSortListings.addEventListener("change", listingsHandleOrderBy);

  /** @type {HTMLSelectElement} */
  const tabSortBids = document.querySelector("#order-By-Bids");
  tabSortBids.addEventListener("change", bidsHandleOrderBy);
}

/**
 * @description Sort the user array listings by a specified key
 * @method listingsHandleOrderBy
 * @param {Event} ev The event from the `select` element.
 * @example
 * // if the select value is 'title', it return the listings sorted alphabetically a-z.
 * // if the select value is 'newest', it returns the newest listings first.
 * // if the select value is 'oldest', it returns the oldest listings first.
 */
function listingsHandleOrderBy(ev) {
  const select = /** @type {HTMLSelectElement} */ (ev.currentTarget);
  const oby = select.value;

  if (oby === "title") {
    dataProfile.sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1,
    );
  } else if (oby === "newest") {
    dataProfile.sort(function (v1, v2) {
      return new Date(v2.created).getTime() - new Date(v1.created).getTime();
    });
  } else if (oby === "oldest") {
    dataProfile.sort(function (v1, v2) {
      return new Date(v1.created).getTime() - new Date(v2.created).getTime();
    });
  }
  updateListings(dataProfile);
}

/**
 * @description Sort the user array bids by a specified key
 * @method listingsHandleOrderBy
 * @param {Event} ev The event from the `select` element.
 * @example
 * // if the select value is 'title', it return the bids sorted alphabetically a-z.
 * // if the select value is 'newest', it returns the newest bids first.
 * // if the select value is 'oldest', it returns the oldest bids first.
 */
function bidsHandleOrderBy(ev) {
  const select = /** @type {HTMLSelectElement} */ (ev.currentTarget);
  const oby = select.value;

  if (oby === "title") {
    bidsProfile.sort((a, b) =>
      a.listing.title.toLowerCase() > b.listing.title.toLowerCase() ? 1 : -1,
    );
  } else if (oby === "newest") {
    bidsProfile.sort(function (v1, v2) {
      return new Date(v2.created).getTime() - new Date(v1.created).getTime();
    });
  } else if (oby === "oldest") {
    bidsProfile.sort(function (v1, v2) {
      return new Date(v1.created).getTime() - new Date(v2.created).getTime();
    });
  }
  updateBids(bidsProfile);
}

/**
 * @description Send a request to API
 * @async
 * @function displayListings
 * @param {string} username  The user name
 * @returns {Promise<GetProfileListingDataResponse[]|null|undefined>} If response is ok, return listings info. If response is not ok, return null. Returns undefined for unexpected errors.
 *
 * */
export async function displayListings(username) {
  try {
    displaySpinner(true, "#spinnerListings");
    displayError(false, "#errorListings");

    const url =
      API_BASE + API_LISTINGS_PROFILE(username) + API_GET_LISTINGS_PARAMS;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      /** @type {GetProfileListingsResponse} */
      const listingsData = await response.json();
      dataProfile = listingsData.data;

      updateListings(dataProfile);
      return dataProfile;
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
 * @description Map a listing to html content
 * @method updateListings
 * @param {Array<GetProfileListingDataResponse>} data The user listings info.
 */
export async function updateListings(data) {
  /** @type {HTMLDivElement} */
  const listings = document.querySelector("#listings");
  listings.innerHTML = "";

  if (data.length === 0) {
    listings.innerHTML = "No listings available!";
  } else {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      /** @type {HTMLTemplateElement} */
      const template = document.querySelector("#listing");
      const listing = /** @type {HTMLDivElement} */ (
        template.content.cloneNode(true)
      );

      listing.querySelector("article").dataset.id = String(item.id);

      const endsAtDate = new Date(item.endsAt);
      countDown(
        1 * 1000,
        endsAtDate,
        ({ distance, days, hours, minutes, seconds }) => {
          const deadline = document.querySelector(
            `article[data-id="${item.id}"] #deadlineListings`,
          );
          if (distance > 0) {
            const dayOfWeek = daysOfWeek[endsAtDate.getDay()];
            deadline.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s Left, ${dayOfWeek}`;
          } else {
            deadline.innerHTML = "EXPIRED";
          }
        },
      );

      listing.querySelector("h5").innerText = item.seller.name; //item.id
      /** @type {HTMLImageElement} */
      const authorImg = listing.querySelector("#sellerImg");
      authorImg.src = item.seller.avatar.url;

      const { media } = item;

      if (media) {
        const listingImgs = listing.querySelector("#listingImgs");

        /** @type {HTMLTemplateElement} */
        const templateCarousel = document.querySelector("#slider-carousel");
        const CloneCarousel = /** @type {HTMLDivElement} */ (
          templateCarousel.content.cloneNode(true)
        );

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

          imgs.innerHTML += `<div class="carousel-item ${i === 0 ? "active" : ""}"><img src="${img.url}" class="d-block img-fluid" alt="${img.alt}"></div>`;
        }

        if (media.length <= 1) {
          prev.style.display = "none";
          next.style.display = "none";
        }

        listingImgs.appendChild(CloneCarousel);
      }

      listing.querySelector("#bodyTitle").innerHTML = sanitize(item.title);
      listing.querySelector("#bodyListing").innerHTML = sanitize(
        item.description,
      );

      let date = new Date(item.created);
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

      /** @type {HTMLInputElement} */
      const txtTitle = listing.querySelector("#listingTitle");
      txtTitle.value = item.title;

      /** @type {HTMLTextAreaElement} */
      const txtBody = listing.querySelector("#listingText");
      txtBody.value = item.description;

      listings.appendChild(listing);
    }
  }
}

/**
 * @description Send a request to API
 * @async
 * @function fetchUserMetaData
 * @param {string} username  The user name
 * @returns {Promise<GetProfileDataResponse|null|undefined>}
 * */
export async function fetchUserMetaData(username) {
  try {
    displaySpinner(true, "#spinnerProfileData");
    displayError(false, "#errorProfileData");

    const url = API_BASE + API_DATA_PROFILE(username);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      /** @type {GetProfileResponse} */
      const profileData = await response.json();
      const profileInfo = profileData.data;
      displayUserMetaData(profileInfo);
      return profileInfo;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, "#errorProfileData", msg);
    return null;
  } catch (ev) {
    displayError(true, "#errorProfileData", "Could not show the profile data!");
  } finally {
    displaySpinner(false, "#spinnerProfileData");
  }
}

/**
 * @description Displays the number of wins, the number of listings and the number of credits.
 * @method displayUserMetaData
 * @param {GetProfileDataResponse} profileInfo user profile info
 */
async function displayUserMetaData(profileInfo) {
  // /** @type {GetProfileDataResponse} */
  // profileInfo;

  /** @type {HTMLDivElement} */
  const totFollowing = document.querySelector("#totWins");
  totFollowing.innerText = String(profileInfo._count.wins);

  /** @type {HTMLDivElement} */
  const totFollowers = document.querySelector("#totListings");
  totFollowers.innerText = String(profileInfo._count.listings);

  /** @type {HTMLDivElement} */
  const totListings = document.querySelector("#totCredits");
  totListings.innerText = String(profileInfo.credits);
}

/**
 * @description Set the event to modal dialog
 * @method addEventToEditProfile
 */
async function addEventToEditProfile() {
  displayError(false, "#errorProfile");

  const showBtn = document.querySelector("#show-dialog");
  const profileForm = document.querySelector("#editAvatar");

  /** @type {HTMLDialogElement} */
  const dialog = document.querySelector("#dialog");
  const closeBtn = dialog.querySelector("#close");

  let { avatarUrl } = getProfileInfo();

  showBtn.addEventListener("click", () => {
    /** @type {HTMLImageElement} */
    const authorImg = document.querySelector("#authorAvatar");
    authorImg.src = avatarUrl;

    dialog.showModal();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.close();
  });

  //Update avatar image
  profileForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

    avatarUrl = form.elements["avatarUrl"].value;
    const result = await fetchUpdateProfile(name, avatarUrl);
    if (result) {
      // await fetchUserMetaData(name);
      updateProfile(result.avatar.url, result.name, result.bio);

      dialog.close();
    }
  });
}

/**
 * @description Update user avatar, name and bio
 * @method updateProfile
 * @param {string} avatarUrl  The url of the user image/avatar
 * @param {string} username  The user name
 * @param {string} bio  The user bio
 */
function updateProfile(avatarUrl, username, bio) {
  /** @type {HTMLImageElement} */
  const img = document.querySelector("#author-image");
  img.src = avatarUrl;

  /** @type {HTMLHeadingElement} */
  const authorInfoName = document.querySelector("#author-info h2");
  authorInfoName.innerText = username;

  /** @type {HTMLParagraphElement} */
  const authorInfoBio = document.querySelector("#author-info p");
  authorInfoBio.innerHTML = bio;
}

/**
 * @description Send a request to API
 * @async
 * @function fetchUpdateProfile
 * @param {string} username  The user name
 * @param {string} avatarUrl  The url of the user image/avatar
 * @returns {Promise<GetProfileDataResponse2|null|undefined>}
 * */
export async function fetchUpdateProfile(username, avatarUrl) {
  try {
    displaySpinner(true, "#spinnerProfileData");
    displayError(false, "#errorProfileData");

    const url = API_BASE + API_DATA_PROFILE(username);

    const request = {
      avatar: {
        url: avatarUrl,
        alt: "Author image",
      },
    };

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(request),
    });

    if (response.ok) {
      /** @type {GetProfileResponse2} */
      const profileData = await response.json();

      const dataProfile = profileData.data;

      save("profile", dataProfile);

      return dataProfile;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, "#errorProfileData", msg);

    return null;
  } catch (ev) {
    displayError(true, "#errorProfileData", "Could not update the image!");
  } finally {
    displaySpinner(false, "#spinnerProfileData");
  }
}

/**
 * @description Send a request to API
 * @async
 * @function displayBids
 * @param {string} username  The user name
 * @returns {Promise<GetProfileBidsDataResponse[]|null|undefined>} If response is ok, return bids info. If response is not ok, return null. Returns undefined for unexpected errors.
 * */
export async function displayBids(username) {
  try {
    displaySpinner(true, "#spinnerBids");
    displayError(false, "#errorBids");

    const url = API_BASE + API_DATA_PROFILE(username) + API_BIDS_PROFILE;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {
      /** @type {GetProfileBidsResponse} */
      const profileBids = await response.json();
      bidsProfile = profileBids.data;

      updateBids(bidsProfile);
      return bidsProfile;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, "#errorBids", msg);

    return null;
  } catch (ev) {
    displayError(true, "#errorBids", "Could not show the bids!");
  } finally {
    displaySpinner(false, "#spinnerBids");
  }
}

/**
 * @description Map a listing to html content
 * @method updateBids
 * @param {Array<GetProfileBidsDataResponse>} data The user listings info.
 */
export async function updateBids(data) {
  /** @type {HTMLDivElement} */
  const bids = document.querySelector("#bids");
  bids.innerHTML = "";

  if (data.length === 0) {
    bids.innerHTML = "No bids available!";
  } else {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      /** @type {HTMLTemplateElement} */
      const template = document.querySelector("#bid");
      const bid = /** @type {HTMLDivElement} */ (
        template.content.cloneNode(true)
      );

      bid.querySelector("article").dataset.id = String(item.id);

      const endsAtDate = new Date(item.listing.endsAt);
      countDown(
        1 * 1000,
        endsAtDate,
        ({ distance, days, hours, minutes, seconds }) => {
          const deadline = document.querySelector(
            `article[data-id="${item.id}"] #deadlineBids`,
          );
          if (distance > 0) {
            const dayOfWeek = daysOfWeek[endsAtDate.getDay()];
            deadline.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s Left, ${dayOfWeek}`;
          } else {
            deadline.innerHTML = `<div class="text-danger fw-bold">EXPIRED<div/>`;
          }
        },
      );

      bid.querySelector("#bodyBidTitle").innerHTML = sanitize(
        item.listing.title,
      );

      bid.querySelector("#bodyBid").innerHTML = sanitize(
        item.listing.description,
      );

      bid.querySelector("#amount").innerHTML = String(item.amount);

      /** @type Intl.DateTimeFormatOptions */
      const options = {
        // weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };

      const placedAtDate = new Date(item.created);
      let placedAtDateString = placedAtDate.toLocaleDateString(
        "no-NO",
        options,
      );
      bid.querySelector("#placedAt").innerHTML = placedAtDateString;

      // `BCP 47 language tag` => no-NO
      let endsAtDateString = endsAtDate.toLocaleDateString("no-NO", options);
      bid.querySelector("#endsAt").innerHTML = endsAtDateString;

      const accordionBid = `accordion_${item.id}`;

      /** @type {HTMLButtonElement} */
      const btnCollapseBid = bid.querySelector("#btnCollapseBid");
      btnCollapseBid.dataset.bsTarget = `#${accordionBid}`;

      /** @type {HTMLDivElement} */
      const descBidBox = bid.querySelector("#collapseBid");
      descBidBox.id = `${accordionBid}`;

      bids.appendChild(bid);
    }
  }
}
