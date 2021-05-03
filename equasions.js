import { Vec2 } from "./utils/vectors.js";

/**
 * List of all the equasions that have been derived
 * 
 * @type { {
 *      [x: string]: {
 *          [x: string]: function
 *      }
 * } }
 */
const equasions = {
    projectile: {
        /**
         * Calculate x position
         * 
         * @param {number} t - time in seconds
         * @param {number} g - gravity in m/s^2
         * @param {number} theta - initial velocity angle in radians
         * @param {number} v - initial velocity magnitude in m/s
         * @param {number} x0 - initial x position
         */
        x: (t, g, theta, v, x0) => 0 // < insert your expression here (in replacement of 0)
        ,

        /**
         * Calculate y position
         * 
         * @param {number} t - time in seconds
         * @param {number} g - gravity in m/s^2
         * @param {number} theta - initial velocity angle in radians
         * @param {number} v - initial velocity magnitude in m/s
         * @param {number} y0 - initial y position
         */
        y: (t, g, theta, v, y0) => 0 // < insert your expression here (in replacement of 0)
        ,

        // -------- or ---------

        /**
         * Calculate vector position p
         * 
         * @param {number} t - time in seconds
         * @param {Vec2} g - gravity in m/s^2
         * @param {Vec2} v - initial velocity magnitude in m/s
         * @param {Vec2} p0 - initial position
         */
        p: (t, g, v, p0) => new Vec2(0, 0)
    }
};

export { equasions };
