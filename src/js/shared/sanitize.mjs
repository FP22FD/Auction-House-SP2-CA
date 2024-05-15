import DOMPurify from "dompurify";

/**
 * @description Sanitize a html string to be safe to use
 * @function sanitize
 * @param {string} html The html string to be sanitized.
 * @returns {string} Returns the result of html sanitization.
 * @example
 * // returns 'Hi';
 * const sanitized = sanitize('<script></script>Hi');
 * @example
 * // returns '<p>Hi</p>';
 * const sanitized = sanitize('<p>Hi</p>');
 */
export function sanitize(html) {
  // @ts-ignore
  return DOMPurify.sanitize(html);
}
