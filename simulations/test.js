// Testing grounds. Not an actual simulation

import { Graph } from "/engine/components/graph/Graph.js";
import { World } from "/engine/World.js";
import { Grid } from "/engine/components/Grid.js";

export function start(newWorld) {
    const world = newWorld;
    const graph = new Graph();

    world.addElm(graph);

    const graphData = [];
    
    for (let i = 0; i < 100; i++) {
        const x = i * 2;
        graphData.push([x * x / 10, Math.sin(x * x / 1e3)]);
    }

    graph.setData(graphData);
    graph.fitScaleToData();
    graph.draw();
    console.log(graph);

    world.addElm(new Grid());
}
