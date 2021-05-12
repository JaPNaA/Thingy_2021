// Testing grounds. Not an actual simulation

import { HTMLCanvasElm } from "../ui/htmlCanvas/HTMLCanvasElm.js";
import { Elm, InputElm } from "../utils/elements.js";

class HTMLCanvasInputElm extends HTMLCanvasElm {
    constructor() {
        super();

        this.append(new InputElm());
    }
}

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    simulationView.htmlCanvas.addElm(
        new HTMLCanvasInputElm()
    );
}

export function update() { }

export function stop() { }
