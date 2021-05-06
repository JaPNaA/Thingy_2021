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
    x: (t, g, theta, v, x0) => v * Math.cos(theta) * t + x0
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
    y: (t, g, theta, v, y0) => v * Math.sin(theta) * t  - g * (t * t)
};


/** @type {import("../ui/canvas/Canvas.js").Canvas} */
let canvas;
let startTime = 0;

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    console.log("projectileMotion");

    canvas = simulationView.canvas;
    startTime = performance.now();
}

const gravity = 9.8;
const angle = Math.PI * 0.25;
const initialVelocity = 40;

export function update() {
    const time = (performance.now() - startTime) / 1000;

    const x = equasions.x(time, gravity, angle, initialVelocity, 0) * 10;
    const y = canvas.height - equasions.y(time, gravity, angle, initialVelocity, 0) * 10;

    canvas.X.clearRect(0, 0, canvas.width, canvas.height);
    canvas.X.fillStyle = "#ff0000";

    canvas.X.beginPath();
    canvas.X.arc(x, y, 4, 0, 2 * Math.PI);
    canvas.X.closePath();
    canvas.X.fill();
}
