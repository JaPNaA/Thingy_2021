import { vec } from "../utils/vectors.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { World } from "../engine/World.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { Elm } from "../utils/elements.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";

const equations = {

    vf1: (m1, m2, vi1, vi2) => (
        ((m1 - m2) / (m1 + m2)) * vi1 +
        ((2 * m2) / (m1 + m2)) * vi2
    ),

    vf2: (m1, m2, vi1, vi2) => (
        ((2 * m2) / (m1 + m2)) * vi1 + 
        ((m1 - m2) / (m1 + m2)) * vi2
    )

};

//User Inputs
const velocity1Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
velocity1Input.setUnitText("m/s");

const mass1Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
mass1Input.setUnitText("kg");

const velocity2Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
velocity2Input.setUnitText("m/s");

const mass2Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
mass2Input.setUnitText("m/s");


class CollisionDraw extends CanvasElm {
    
    constructor(){
        
        super();

        this.pos = vec(0, 0);
    }

    draw(){
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        X.beginPath
        X.fillStyle = "#ff0000";
        X.fill();
    }
}

let world;

export function start(newWorld) {
    world = newWorld;
}
