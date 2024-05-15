//storage API endpoints
export const API_BASE = "https://v2.api.noroff.dev";

// @ts-ignore
// eslint-disable-next-line no-undef
export const API_KEY = import.meta.env.VITE_API_KEY || "__VITE_API_KEY__";

export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_AUTH = "/auth";

export const API_LISTINGS = "/auction/listings";
export const API_SEARCH = "/search?_seller=true&_active=true&q=";
export const API_GET_LISTINGS_PARAMS =
  "?sort=created&sortOrder=desc&limit=100&_seller=true&_active=true";

export const API_DATA_PROFILE = (name) => `/auction/profiles/${name}`;
export const API_LISTINGS_PROFILE = (name) =>
  `/auction/profiles/${name}/listings`;

export const API_BIDS_PROFILE = `/bids?_listings=true`;
export const API_BID_ON_LISTING = (listingId) =>
  `${API_LISTINGS}/${listingId}/bids`;
