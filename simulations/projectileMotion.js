import { vec } from "../utils/vectors.js";
import { World } from "../ui/canvas/World.js";
import { VectorLinearInput } from "../ui/canvas/vectorInput/VectorLinearInput.js";
import { VectorInput } from "../ui/canvas/vectorInput/VectorInput.js";
import { TimePath } from "../ui/canvas/timePath/TimePath.js";
import { CanvasElm } from "../ui/canvas/CanvasElm.js";

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

class Ball extends CanvasElm {
    constructor() {
        super();
        this.pos = vec(0, 0);
    }

    draw() {
        const X = this.world.canvas.X;
        
        X.fillStyle = "#ff0000";

        X.beginPath();
        X.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
        X.closePath();
        X.fill();
    }
}

/** @type {import("../ui/canvas/World.js").World} */
let world;

const ball = new Ball();

const vInput = new VectorInput(vec(10, 10), vec(10, 400));
const timeInput = new VectorLinearInput(vec(10, 0), vec(10, 10));
const timePath = new TimePath();

const gravity = -9.8;

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    console.log("projectileMotion");

    world = new World(simulationView.canvas);

    world.addElm(vInput);
    world.addElm(timeInput);
    world.addElm(timePath);
    world.addElm(ball);

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

    ball.pos = vec(x, y);

    // temp: timepath generation
    timePath.clearNodes();

    for (let i = 0; i < 10; i += 0.1) {
        timePath.addNode(
            equasions.x(i, gravity, angle, initialVelocity, 0),
            equasions.y(i, gravity, angle, initialVelocity, 0),
            i
        );
    }

    world.draw();
}

export function stop() {
    world.setdown();
}
