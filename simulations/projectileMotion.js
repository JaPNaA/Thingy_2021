import { vec } from "../utils/vectors.js";
import { World } from "../engine/World.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { VectorInput } from "../engine/components/vectorInput/VectorInput.js";
import { TimePath } from "../engine/components/timePath/TimePath.js";
import { HoverPoint } from "../engine/components/HoverPoint.js";

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
    y: (t, g, theta, v, y0) => v * Math.sin(theta) * t  - g * (t * t) / 2 + y0
};

/** @type {import("../ui/canvas/World.js").World} */
let world;

const ball = new HoverPoint();

const timeInput = new VectorLinearInput(vec(10, 0), vec(10, 10));
timeInput.setUnitText("s");

const vInput = new VectorInput(vec(10, -10), vec(10, 400));
vInput.onUserChange.addHandler(() => updateTimePath());
vInput.setUnitText("m/s");

const initialPositionInput = new VectorInput(vec(100, -200), vec(200, 400));
initialPositionInput.setUnitText("m");
initialPositionInput.onUserChange.addHandler(() => {
    updateTimePath();
    putVInputOnInitialPositionVectorHead();
});

const timePath = new TimePath();

const gravity = -9.8;

let realTimeMode = false;

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    console.log("projectileMotion");

    world = new World(simulationView);

    world.addElm(vInput);
    world.addElm(timeInput);
    world.addElm(timePath);
    world.addElm(initialPositionInput);
    world.addElm(ball);

    resize();

    world.keyboard.addKeyDownListener("Space", () => {
        realTimeMode = true;
    });
    world.keyboard.addKeyUpListener("Space", () => {
        realTimeMode = false;
    });
    
    updateTimePath();
    putVInputOnInitialPositionVectorHead();
}

export function resize() {
    vInput.setTailPos(vec(32, innerHeight - 32));
}


export function update(timeElapsed) {
    if (realTimeMode) {
        timeInput.setMagnitude(timeInput.getMagnitude() + timeElapsed);
    }

    const time = timeInput.getMagnitude();

    const baseOffset = initialPositionInput.getTailPos();
    ball.pos = getPositionAtTime(time).subtract(baseOffset);
    ball.offset = baseOffset;

    world.draw();
}

function updateTimePath() {
    timePath.clearNodes();

    for (let i = 0; i < 20; i += 0.1) {
        const pos = getPositionAtTime(i);
        timePath.addNode(pos.x, pos.y, i);
    }
}

function putVInputOnInitialPositionVectorHead() {
    vInput.setTailPos(initialPositionInput.getVec2().add(initialPositionInput.getTailPos()));
}

function getPositionAtTime(time) {
    const velocity = vInput.getVec2();
    const initialPosition = initialPositionInput.getVec2().add(initialPositionInput.getTailPos());

    return vec(
        equasions.x(time, gravity, velocity.angle, velocity.magnitude, initialPosition.x),
        equasions.y(time, gravity, velocity.angle, velocity.magnitude, initialPosition.y)
    );
}

export function stop() {
    world.setdown();
}
