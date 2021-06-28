import { vec } from "../utils/vectors.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { HoverPoint } from "../engine/components/HoverPoint.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { Grid } from "../engine/components/Grid.js";

const equasions = {
    x: (x0, v, a, t) => x0 + v * t + a * t*t / 2
};

let world;
const velocityInput = new VectorLinearInput(vec(10, 0), vec(100, 100));
velocityInput.setUnitText("m/s");
velocityInput.setVariableName("v");

const accelerationInput = new VectorLinearInput(vec(10, 0), vec(100, 120));
accelerationInput.setUnitText("m/s²");
accelerationInput.setVariableName("a");

const timeInput = new ScalarInputElm();
timeInput.onUserChange.addHandler(v => time = v);
timeInput.addTextAfter("s");
timeInput.addTextBefore("t =");
timeInput.setPos(vec(100, 140));

const ball = new HoverPoint();

let realTimeMode = false;
let time = 0;

export function start(newWorld) {
    world = newWorld;
    world.addElm(velocityInput, accelerationInput, ball, timeInput, new Grid());

    world.keyboard.addKeyDownListener("Space", () => {
        realTimeMode = true;
    });
    world.keyboard.addKeyUpListener("Space", () => {
        realTimeMode = false;
    });

    ball.offset = vec(0, 200);
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
