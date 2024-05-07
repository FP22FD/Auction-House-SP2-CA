/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

/**
 * @description Handle the API response errors.
 * @class ErrorHandler
 */
export class ErrorHandler {
  _response;

  /** @param {Response} response */
  constructor(response) {
    this._response = response;
  }

  /**
   * @description Convert the API response errors msg in a human readable way.
   * @function getErrorMessage
   * @returns {Promise<string>} If the response is ok, return a empty string. Otherwise return a string msg.
   */
  async getErrorMessage() {
    if (this._response.ok) {
      return "";
    }

    let errorMessage = "";

    if (this._response.status === 400) {
      /** @type {BadRequestResponse} */
      const data = await this._response.json();
      errorMessage = data.errors[0].message;
    } else if (this._response.status === 401) {
      errorMessage =
        "Invalid username or password or you do not have an account yet!";
    } else if (this._response.status === 404) {
      errorMessage = "The requested resource was not found!";
    } else {
      errorMessage = "Unknown error! Please retry later.";
    }
    return errorMessage;
  }
}
