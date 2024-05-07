/**
 * @description Display a message error
 * @method displayError
 * @param {boolean} visible If true, shows the msg error, otherwise hides it.
 * @param {string} id Show error msg by id
 * @param {string} [text]  The message to show, or `undefined` if `visible` is false.
 * * @example
 * // Hide the error message
 * displayError(false);
 * @example
 * // Show the error message
 * displayError(true, "#errorPosts", 'Error message');
 */
export function displayError(visible, id, text) {
  /** @type {HTMLDivElement} */
  const error = document.querySelector(id);

  if (!error) {
    return;
  }

  if (visible === true) {
    error.innerHTML = text;

    error.classList.remove("d-none");
    error.classList.add("d-flex");
  } else {
    error.classList.remove("d-flex");
    error.classList.add("d-none");
  }
}
