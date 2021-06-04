import { World } from "../engine/World.js";
import { Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";

const G = 6.67e-11;

/**
 * @typedef {Object} PlanetDataEntry
 * @property {number} mass - mass in kilograms
 * @property {number} radius - radius in meters
 */

/**
 * @type { { [x: string]: PlanetDataEntry } }
 */
const planetData = {
    earth: {
        mass: 5.98e24,
        radius: 6.398e6,
    },

    moon: {
        mass: 7.34767309e22,
        radius: 1731.1e3,
    },

    mercury: {
        mass: 3.285e23,
        radius: 2439.7e3,
    },

    mars: {
        mass: 6.39e23,
        radius: 3389.5e6,
    },

    venus: {
        mass: 4.867e24,
        radius: 6051.8,
    },

    jupitar: {
        mass: 1.898e27,
        radius: 69911,
    },

    neptune: {
        mass: 1.024e26,
        radius: 24622e6
    },

    // saturn: 
};

class OrbitDraw extends CanvasElm {
    constructor() {
        super();

        this.angle = 0;
        this.distance = 0;
        this.pos = vec(0, 0);
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const pos =
            Vec2.fromPolar(this.distance, this.angle)
            .add(this.pos);
        
        X.beginPath();
        X.arc(pos.x, pos.y, 100, 0, 2*Math.PI);
        X.fillStyle = "#ff0000";
        X.fill();
        
    }
}

const expressionSolver = new ExpressionSolver({
    variables: ["v", ["m", planetData.earth.mass], ["r", planetData.earth.radius]],
    expression: vars => new Expression( // v^2 = GM / r
        "subtract",
        new Expression(
            "power", vars.v, 2
        ),
        
        new Expression(
            "divide",
            new Expression(
            "multiply", G, vars.m
            ),
            vars.r
        )
    )
});

let world;
let orbitDraw = new OrbitDraw();

export function start(asdf) {
    world = new World(asdf);
    world.addElm(orbitDraw);

    expressionSolver.addFormToWorld(world);
}

export function update(timeElapsed) {
    const angularVelocity = expressionSolver.variables.v.eval() / expressionSolver.variables.r.eval();

    orbitDraw.angle += angularVelocity * timeElapsed;
    orbitDraw.distance = expressionSolver.variables.r.eval();
    
    world.draw();
}

export function end() { }
