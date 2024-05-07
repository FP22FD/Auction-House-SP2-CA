import { API_BASE, API_AUTH, API_REGISTER } from "../settings.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";

// generated via https://transform.tools/json-to-jsdoc

/** @typedef {object} RegisterResponse
 * @property {object} data
 * @property {string} data.name
 * @property {string} data.email
 * @property {string} data.bio
 * @property {object} data.avatar
 * @property {string} data.avatar.url
 * @property {string} data.avatar.alt
 * @property {object} data.banner
 * @property {string} data.banner.url
 * @property {string} data.banner.alt
 */

/**
 * @description This function send a request to register a new user return
 * @async
 * @function register
 * @param {string} name user name
 * @param {string} email user email
 * @param {string} psw user password
 * @return {Promise<RegisterResponse|null|undefined>} If response is ok, return the user info. If response is not ok, return null. Returns undefined for unexpected errors.
 */
export async function register(name, email, psw) {
  try {
    displaySpinner(true, "#spinnerRegister");
    displayError(false, "#error");

    const url = API_BASE + API_AUTH + API_REGISTER;
    const request = {
      name: name,
      email: email,
      password: psw,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      /** @type {RegisterResponse} */
      const data = await response.json();
      return data;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, "#error", msg);

    return null;
  } catch (ev) {
    displayError(true, "#error", "Could not register the account!");
  } finally {
    displaySpinner(false, "#spinnerRegister");
  }
}
