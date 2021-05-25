import { World } from "../engine/World.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { InputElm } from "../utils/elements.js";
import { Variable, Expression } from "../utils/mathLib.js";

let world;

class Input extends ScalarInputElm {
    /** @param {Variable} variable */
    constructor(variable) {
        super();
        this.fixedPosition = true;

        this.variable = variable;
    }
}

const vVar = new Variable("v");
const aVar = new Variable("a");
const rVar = new Variable("r");
const expression = new Expression(
    "subtract",
    aVar,
    new Expression("divide",
        new Expression("power", vVar, 2),
        rVar
    )
);

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