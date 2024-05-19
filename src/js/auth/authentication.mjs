// Import our custom CSS
import "../../scss/styles.scss";

// Import all of Bootstrap's JS
// eslint-disable-next-line no-unused-vars
// import * as bootstrap from 'bootstrap'

import { displayError } from "../shared/displayErrorMsg.mjs";
import { login } from "./login.mjs";
import { register } from "./register.mjs";

export function init() {
  addEventToLogin();
  addEventToRegister();

  const showPws = document.querySelector("#showPassword");
  showPws.addEventListener("click", displayLoginPassword);

  const hidePws = document.querySelector("#hidePassword");
  hidePws.addEventListener("click", displayLoginPassword);
}

/**
 * @description Attaches an event handler to the login form element.
 * @method addEventToLogin
 */
function addEventToLogin() {
  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    /** @type {HTMLInputElement} */
    const inputPws = document.querySelector("#loginPassword");
    inputPws.setAttribute("type", "password");

    // This is called Casting or Type Casting ("force way to ignore type errors"): https://dev.to/samuel-braun/boost-your-javascript-with-jsdoc-typing-3hb3
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget); // return the form HTML element that has the event listener

    const email = form.elements["loginEmail"].value;
    const password = form.elements["loginPassword"].value;

    const profile = await login(email, password);
    if (profile === null) {
      return;
    }
    window.location.href = "../profile/index.html";
  });
}

/**
 * @description Attaches an event handler to the register form element.
 * @function addEventToRegister
 */
function addEventToRegister() {
  const registerForm = document.querySelector("#register-form");
  registerForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    /** @type {HTMLInputElement} */
    const inputPws = document.querySelector("#loginPassword");
    inputPws.setAttribute("type", "password");

    const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

    const name = form.elements["username"].value;
    const email = form.elements["emailAddress"].value;
    const password = form.elements["password"].value;
    const confirmPassword = form.elements["confirmPassword"].value;

    if (password !== confirmPassword) {
      displayError(true, "#error", "The passwords have to match!");
      return;
    }
    const response = await register(name, email, password);
    if (!response) {
      return;
    }

    const profile = await login(email, password);
    if (profile === null) {
      return;
    }

    window.location.href = "../profile/index.html";
  });
}

/**
 * @description Set the input type text<=>password.
 * @method displayLoginPassword
 */
function displayLoginPassword() {
  /** @type {HTMLInputElement} */
  const inputPws = document.querySelector("#loginPassword");

  const showPws = document.querySelector("#showPassword");
  const hidePws = document.querySelector("#hidePassword");

  if (inputPws.type === "password") {
    inputPws.setAttribute("type", "text");

    hidePws.classList.remove("d-flex");
    hidePws.classList.add("d-none");
    showPws.classList.remove("d-none");
  } else {
    inputPws.setAttribute("type", "password");

    hidePws.classList.add("d-flex");
    hidePws.classList.remove("d-none");
    showPws.classList.add("d-none");
  }
}
