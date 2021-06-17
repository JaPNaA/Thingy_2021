import { vec } from "../utils/vectors.js";
import { World } from "../engine/World.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { VectorInput } from "../engine/components/vectorInput/VectorInput.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { TimePath } from "../engine/components/timePath/TimePath.js";
import { HoverPoint } from "../engine/components/HoverPoint.js";
import { Grid } from "../engine/components/Grid.js";

/**
 * Calculate a position in time
 * 
 * @param {number} t - time in seconds
 * @param {Vec2} a - acceleration in m/s^2
 * @param {Vec2} v - initial velocity magnitude in m/s
 * @param {Vec2} x - initial position
 */
const equation = (t, a, v, x) => 
    v.scale(t).add(a.scale(t * t / 2)).add(x);

/** @type {import("../ui/canvas/World.js").World} */
let world;

const ball = new HoverPoint();

const timeInput = new ScalarInputElm();
timeInput.addTextAfter("s");
timeInput.staticPosition = true;

const aInput = new VectorInput(vec(0, 9.8), vec(10, 50));
aInput.onUserChange.addHandler(() => updateTimePath());
aInput.setUnitText("m/s²");

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

let realTimeMode = false;

export function start(newWorld) {
    console.log("projectileMotion");

    world = newWorld;

    world.addElm(
        vInput,
        timeInput,
        timePath,
        initialPositionInput,
        ball,
        aInput,
        new Grid()
    );
    
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
        timeInput.setValue(timeInput.getValue() + timeElapsed);
    }

    const time = timeInput.getValue();

    const baseOffset = initialPositionInput.getTailPos();
    ball.pos = getPositionAtTime(time).subtract(baseOffset);
    ball.offset = baseOffset;
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
    const initialPosition = initialPositionInput.getVec2().add(initialPositionInput.getTailPos());
    return equation(time, aInput.getVec2(), vInput.getVec2(), initialPosition);
}

