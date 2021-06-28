import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { colors } from "../ui/colors.js";
import { vec } from "../utils/vectors.js";
import { Grid } from "../engine/components/Grid.js";

const speedOfLight = 299_792_458;

class SpacetimeGraph extends CanvasElm {
    constructor() {
        super();

        this.velocity = 0;

        /** @type {ObjectPath[]} */
        this.paths = [new ObjectPath()];
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        for (const path of this.paths) {
            X.beginPath();
            X.strokeStyle = colors.white;

            for (const point of path.points) {
                const {x, y} = this._lorentzTransform(point);
                X.lineTo(x, -y);
            }

            X.stroke();
        }
    }

    _lorentzTransform(pointVec) {
        const beta = this.velocity / speedOfLight;
        const gamma = 1 / Math.sqrt(1 - beta * beta);
        return vec(
            gamma * (pointVec.x - beta * pointVec.y),
            gamma * (pointVec.y - beta * pointVec.x)
        );
    }
}

class ObjectPath {
    constructor() {
        this.points = [vec(0, 0), vec(100, 200), vec(0, 300)];
    }
}

/** @type {SpacetimeGraph} */
let spacetimeGraph;

let world;

let velocityChangeDirection = 0;

export function start(newWorld) {
    world = newWorld;
    spacetimeGraph = new SpacetimeGraph();

    world.addElm(spacetimeGraph, new Grid());

    world.keyboard.addKeyDownListener("ArrowLeft", () => {
        velocityChangeDirection = 1;
    })
    world.keyboard.addKeyDownListener("ArrowRight", () => {
        velocityChangeDirection = -1;
    });
    world.keyboard.addKeyUpListener("ArrowLeft", () => {
        velocityChangeDirection = 0;
    });
    world.keyboard.addKeyUpListener("ArrowRight", () => {
        velocityChangeDirection = 0;
    });
}

export function update(elapsedTime) {
    spacetimeGraph.velocity += (speedOfLight / 10) * elapsedTime * velocityChangeDirection;
}
