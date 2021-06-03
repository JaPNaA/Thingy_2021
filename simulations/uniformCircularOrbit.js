import { World } from "../engine/World.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { InputElm } from "../utils/elements.js";
import { Variable, Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";
import { VariableInput } from "../engine/components/variablesForm/VariableInput.js";
import { VariableInputForm } from "../engine/components/variablesForm/VariableInputForm.js";

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

const vVar = new Variable("v");
const mVar = new Variable("m");
const rVar = new Variable("r");

const variableInputForm = new VariableInputForm();

const expression = new Expression( // v^2 = GM / r
    "subtract",
    new Expression(
        "power", vVar, 2
    ),
    
    new Expression(
        "divide",
        new Expression(
           "multiply", G, mVar
        ),
        rVar
    )
);

let world;
let orbitDraw = new OrbitDraw();

export function start(asdf) {
    world = new World(asdf);
    world.addElm(orbitDraw);

    for (const [variable, initialValue] of [[vVar], [mVar, planetData.earth.mass], [rVar, planetData.earth.radius]]) {
        const variableInput = new VariableInput(variable);
        variableInputForm.addVariableInput(variableInput);
        
        if (initialValue) {
            variableInput.setValue(initialValue);
        }

        world.addElm(variableInput);
    }
}

export function update(timeElapsed) {
    const angularVelocity = vVar.eval() / rVar.eval();

    orbitDraw.angle += angularVelocity * timeElapsed;
    orbitDraw.distance = rVar.eval();
    

    world.draw();
}

export function end() { }
