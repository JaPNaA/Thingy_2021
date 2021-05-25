import { World } from "../engine/World.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { InputElm } from "../utils/elements.js";

let world;

class Input extends ScalarInputElm {
    constructor() {
        super();
        this.fixedPosition = true;
    }
}

export function start(simulationView) {
    world = new World(simulationView);
    world.addElm(new Input());
}

export function update() {
    world.draw();
}

export function stop() {
    world.setdown();
}