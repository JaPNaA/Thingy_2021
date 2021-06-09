import {vec} from "../utils/vectors.js";
import {VectorLinearInput} from "../engine/components/vectorInput/VectorLinearInput.js";
import {World} from "../engine/World.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { Elm } from "../utils/elements.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";
/*
const equations{

}

//User Inputs
const velocity1Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
velocityInput.setUnitText("m/s");

const mass1Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
velocityInput.setUnitText("kg");

const velocity2Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
velocityInput.setUnitText("m/s");

const mass2Input = new VectorLinearInput(vec(), vec()); //Position not determined yet
velocityInput.setUnitText("m/s");

export function start(something){
    world = new world(something);
}

export function stop(){
    world.setdown();
}