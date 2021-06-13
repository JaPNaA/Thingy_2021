import { vec } from "../utils/vectors.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { HoverPoint } from "../engine/components/HoverPoint.js";
import { World } from "../engine/World.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";

const equasions = {
    x: (x0, v, a, t) => x0 + v * t + a * t*t / 2
};

let world;
const velocityInput = new VectorLinearInput(vec(10, 0), vec(50, 50));
velocityInput.setUnitText("m/s");

const accelerationInput = new VectorLinearInput(vec(10, 0), vec(50, 70));
accelerationInput.setUnitText("m/s²");

const timeInput = new ScalarInputElm();
timeInput.onUserChange.addHandler(v => time = v);
timeInput.addTextAfter("s");
timeInput.setPos(vec(50, 90));

const ball = new HoverPoint();

let realTimeMode = false;
let time = 0;

export function start(newWorld) {
    world = newWorld;
    world.addElm(velocityInput, accelerationInput, ball, timeInput);

    world.keyboard.addKeyDownListener("Space", () => {
        realTimeMode = true;
    });
    world.keyboard.addKeyUpListener("Space", () => {
        realTimeMode = false;
    });

    ball.offset = vec(0, 8);
}

export function update(timeElapsed) {
    if (realTimeMode) {
        time += timeElapsed;
        timeInput.setValue(time);
    }

    ball.pos = vec(getPositionAtTime(time), 0);
}

function getPositionAtTime(time) {
    return equasions.x(0, velocityInput.getMagnitude(), accelerationInput.getMagnitude(), time);
}
