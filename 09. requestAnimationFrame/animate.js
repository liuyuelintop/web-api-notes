// Version 1 of generic animation function: Linear Animation
const animateLinear = (from, to, duration, callback) => {
  const startTime = performance.now();

  const _run = (now) => {
    const elapsedTime = now - startTime;
    if (elapsedTime >= duration) {
      callback(to);
      cancelAnimationFrame(rid);
      return;
    }

    const t = elapsedTime / duration;
    const value = from + (to - from) * t;
    callback(value);
    rid = requestAnimationFrame(_run);
  };

  let rid = requestAnimationFrame(_run);
};

// Version 2 of generic animate function: with Easing function
/**
 * Animate function to interpolate between 'from' and 'to' values over a given duration
 * @param {Object} options - Options object
 * @param {number} options.from - Starting value
 * @param {number} options.to - Ending value
 * @param {number} options.duration - Duration of the animation in milliseconds
 * @param {Function} options.callback - Function to be called with the current animated value
 * @param {Function} [options.easing=linear] - Easing function to control the animation pace
 */
/**
 * Generic animate function
 * @param {Object} options - Options for the animation
 * @param {number} options.from - Starting value
 * @param {number} options.to - Ending value
 * @param {number} options.duration - Duration of the animation in milliseconds
 * @param {Function} options.callback - Function to be called with the current animated value
 * @param {Function} [options.easing=linear] - Easing function to control the animation pace
 */
const animateWithEasing = ({
  from,
  to,
  duration,
  callback,
  easing = linear,
}) => {
  const startTime = performance.now(); // Use performance.now() for more accurate timing

  /**
   * Animation loop function
   * @param {number} now - Current time provided by requestAnimationFrame
   */
  const _run = (now) => {
    const elapsedTime = now - startTime; // Time elapsed since the start of the animation
    if (elapsedTime >= duration) {
      callback(to); // Ensure the final value is exactly 'to'
      cancelAnimationFrame(rid); // Stop the animation loop
      return;
    }

    const normalizedTime = elapsedTime / duration; // Normalized time (0 to 1)
    const easedTime = easing(normalizedTime); // Apply easing function
    const currentValue = from + (to - from) * easedTime; // Calculate current value based on easing
    callback(currentValue); // Update the animation state

    rid = requestAnimationFrame(_run); // Continue the animation loop
  };

  let rid = requestAnimationFrame(_run); // Start the animation loop
};

/**
 * Default linear easing function
 * @param {number} t - Normalized time (0 to 1)
 * @returns {number} - Eased time
 */
const linear = (t) => t;

// Usage example
const box = document.querySelector(".box");

animateWithEasing({
  from: 0,
  to: 300,
  duration: 2000,
  callback: (val) => {
    box.style.left = val + "px";
  },
  easing: linear, // Optional: can be replaced with any other easing function
});
