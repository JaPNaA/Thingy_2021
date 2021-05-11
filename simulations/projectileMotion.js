import { vec } from "../utils/vectors.js";
import { World } from "../ui/canvas/World.js";
import { VectorLinearInput } from "../ui/canvas/vectorInput/VectorLinearInput.js";
import { VectorInput } from "../ui/canvas/vectorInput/VectorInput.js";

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


/** @type {import("../ui/canvas/World.js").World} */
let world;

let vInput = new VectorInput(vec(10, 10), vec(10, 400));
let timeInput = new VectorLinearInput(vec(10, 0), vec(10, 10));

const gravity = -9.8;

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    console.log("projectileMotion");

    world = new World(simulationView.canvas);

    world.addElm(vInput);
    world.addElm(timeInput);

    world.keyboard.addKeyDownListener("Space", () => {
        timeInput.setMagnitude(timeInput.getMagnitude() + 1);
    });
}

export function update() {
    const time = timeInput.magnitude / 100;

    const velocity = vInput.getVec2();
    const angle = velocity.angle;
    const initialVelocity = velocity.magnitude;

    const x = equasions.x(time, gravity, angle, initialVelocity, 0);
    const y = equasions.y(time, gravity, angle, initialVelocity, 0);

    world.draw();

    world.canvas.X.fillStyle = "#ff0000";

    world.canvas.X.beginPath();
    world.canvas.X.arc(x, y, 4, 0, 2 * Math.PI);
    world.canvas.X.closePath();
    world.canvas.X.fill();
}
