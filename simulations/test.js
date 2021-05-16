// Testing grounds. Not an actual simulation

import { Graph } from "/engine/components/graph/Graph.js";
import { World } from "/engine/World.js";

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    const world = new World(simulationView);
    const graph = new Graph();

    world.addElm(graph);

    const graphData = [];
    
    for (let i = 0; i < 100; i++) {
        graphData.push([i * 2, (i - 50)**2]);
    }

    graph.setData(graphData);
    graph.fitScaleToData();
    graph.draw();
    console.log(graph);
}

export function update() { }

export function stop() { }
