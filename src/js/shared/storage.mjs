/**
 * @description Get key from local storage
 * @function load
 * @param {string} key The object key
 * @returns {object | null} If the key exists, return a JSON object. Otherwise returns null.
 */
export function load(key) {
  const storedKey = localStorage.getItem(key);
  const value = storedKey ? JSON.parse(storedKey) : null;
  return value;
}

/**
 * @description Save in the local storage
 * @method save
 * @param {string} key The object key
 * @param {(string|object)} value The object to be saved.
 */
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description Remove the key from local storage
 * @method remove
 * @param {string} key The key to be deleted.
 */
export function remove(key) {
  localStorage.removeItem(key);
}
