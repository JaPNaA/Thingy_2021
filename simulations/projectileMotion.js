const equasions = {
    /**
     * Calculate x position
     * 
     * @param {number} t - time in seconds
     * @param {number} g - gravity in m/s^2
     * @param {number} theta - initial velocity angle in radians
     * @param {number} v - initial velocity magnitude in m/s
     * @param {number} x0 - initial x position
     */
    x: (t, g, theta, v, x0) => t // < insert your expression here (in replacement of t)
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
    y: (t, g, theta, v, y0) => t // < insert your expression here (in replacement of t)
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
};

/** @type {import("../ui/Canvas.js").Canvas} */
let canvas;
let startTime = 0;

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    console.log("projectileMotion");

    canvas = simulationView.canvas;
    startTime = performance.now();
}

export function update() {
    const time = (performance.now() - startTime) / 1000;

    const x = equasions.x(time, 9.8, Math.PI / 2, 10, 0) * 10;
    const y = canvas.height - equasions.y(time, 9.8, Math.PI / 2, 10, 0) * 10;

    canvas.X.clearRect(0, 0, canvas.width, canvas.height);
    canvas.X.fillStyle = "#ff0000";

    canvas.X.beginPath();
    canvas.X.arc(x, y, 4, 0, 2 * Math.PI);
    canvas.X.closePath();
    canvas.X.fill();
}
