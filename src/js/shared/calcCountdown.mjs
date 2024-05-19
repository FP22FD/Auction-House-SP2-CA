/** @typedef CountdownResult
 * @type {object}
 * @property {number} distance
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 */

/**
 * Callback for adding two numbers.
 *
 * @callback CountdownCallback
 * @param {CountdownResult} data - A countdown instance.
 */

// Ref: https://www.w3schools.com/howto/howto_js_countdown.asp

/**
 *
 * @param {number} intervalMs Interval in milliseconds to calculate distance between now and the specified date.
 * @param {Date} date The reference date.
 * @param {CountdownCallback} callback
 */
export function countDown(intervalMs, date, callback) {
  const countDownDate = date.getTime();

  // Ref: How to tick immediately: https://stackoverflow.com/a/20706004
  setTimeout(() => {
    const now = new Date().getTime();
    const { distance, days, hours, minutes, seconds } = calcCountdown(now, countDownDate);
    callback({ distance, days, hours, minutes, seconds });
  }, 0);

  const x = setInterval(function () {
    const now = new Date().getTime();

    const { distance, days, hours, minutes, seconds } = calcCountdown(now, countDownDate);

    callback({ distance, days, hours, minutes, seconds });

    if (distance < 0) {
      clearInterval(x);
    }
  }, intervalMs);
}

/**
 * Calculate distance and date parts between two dates.
 * @param {number} start
 * @param {number} end
 * @returns {CountdownResult}
 */
export function calcCountdown(start, end) {
  const distance = end - start;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    distance,
    days,
    hours,
    minutes,
    seconds,
  };
}
