import { API_KEY, API_BASE, API_AUTH } from "../settings.mjs";
import { load } from "../shared/storage.mjs";

/**
 * @description This function send a request to register a new tenant. Should be used only once per user.
 * @async
 * @function requestAPIKey
 * @return {Promise<any|undefined>} If response is ok, return the tenant key. Otherwise it throws.
 */
async function requestAPIKey() {
  const response = await fetch(API_BASE + API_AUTH + API_KEY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${load("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Tester key",
    }),
  });

  if (response.ok) {
    return await response.json();
  }
  console.error(await response.json());
  throw new Error("Could not register for an API key!");
}

requestAPIKey().then(console.log);
