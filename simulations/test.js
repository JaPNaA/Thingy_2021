// Testing grounds. Not an actual simulation

import { HTMLCanvasElm } from "../ui/htmlCanvas/HTMLCanvasElm.js";

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    simulationView.htmlCanvas.addElm(
        new HTMLCanvasElm()
    );
}

export function update() { }