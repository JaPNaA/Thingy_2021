import { vec } from "../utils/vectors.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { World } from "../engine/World.js";

let world;
let startTime;

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    const vectorInput = new VectorLinearInput(vec(10, 10), vec(50, 50));
    world = new World(simulationView);
    world.addElm(vectorInput);

    startTime = performance.now();
}


export function update() {
    world.draw();
}

export function stop() {
    world.setdown();
}
