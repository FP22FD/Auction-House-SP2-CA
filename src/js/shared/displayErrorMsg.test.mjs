/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from "vitest";
import { displayError } from "./displayErrorMsg.mjs";

describe("displayError", () => {
  it("should display an error message", async () => {
    // arrange
    document.body.innerHTML = '<div id="error"></div>';

    // act
    displayError(true, "#error", "Bla bla");

    // assert
    expect(document.querySelector("#error").innerHTML).toBe("Bla bla");
    expect(document.querySelector("#error").classList.contains("d-flex")).toBe(true);
    expect(document.querySelector("#error").classList.contains("d-none")).toBe(false);
  });

  it("should hide an error message", async () => {
    // arrange
    document.body.innerHTML = '<div id="error" class="d-flex"></div>';

    // act
    displayError(false, "#error");

    // assert
    expect(document.querySelector("#error").innerHTML).toBe("");
    expect(document.querySelector("#error").classList.contains("d-flex")).toBe(false);
    expect(document.querySelector("#error").classList.contains("d-none")).toBe(true);
  });
});
