/**
 * @description Show and hide the spinner element
 * @method displaySpinner
 * @param {boolean} spinnerVisible If true, shows the spinner, otherwise hides it.
 * @param {string} id Show spinner by id, otherwise hides it.
 */
export function displaySpinner(spinnerVisible, id) {
  const spinner = document.querySelector(id); //es: #spinnerListings, and others

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
