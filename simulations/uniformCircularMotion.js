import { World } from "../engine/World.js";
import { Variable, Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";
import { VariableInput } from "../engine/components/variablesForm/VariableInput.js";
import { VariableInputForm } from "../engine/components/variablesForm/VariableInputForm.js";

const vVar = new Variable("v");
const aVar = new Variable("a");
const rVar = new Variable("r");
const variableInputForm = new VariableInputForm();
const expression = new Expression(
    "subtract",
    aVar,
    new Expression("divide",
        new Expression("power", vVar, 2),
        rVar
    )
);


class OrbitBall extends CanvasElm {
    constructor() {
        super();
        this.radius = 1;
        this.pos = vec(0, 0);
        this.angle = 0;
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        X.strokeStyle = "#ffffff";
        X.fillStyle = "#ff0000";
        X.lineWidth = 1 / this.world.camera.zoom;

        X.beginPath();
        X.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        X.stroke();

        const ballPosRel = Vec2.fromPolar(this.radius, this.angle);
        const ballPos = ballPosRel.add(this.pos);

        X.beginPath();
        X.arc(ballPos.x, ballPos.y, 4 / this.world.camera.zoom, 0, Math.PI * 2);
        X.fill();

        const accelerationVecHead = ballPosRel.withMagnitude(this.radius - aVar.eval()).add(this.pos);
        X.beginPath();
        X.moveTo(ballPos.x, ballPos.y);
        X.lineTo(accelerationVecHead.x, accelerationVecHead.y);
        X.stroke();
    }
}

const orbitBall = new OrbitBall();

let world;

export function start(simulationView) {
    world = new World(simulationView);
    world.addElm(orbitBall);

    resize();

    for (const [variable, initialValue] of [[vVar], [aVar, 40], [rVar, 100]]) {
        const variableInput = new VariableInput(variable);
        variableInputForm.addVariableInput(variableInput);
        
        if (initialValue) {
            variableInput.setValue(initialValue);
        }

        world.addElm(variableInput);
    }

    variableInputForm.trySolve();
}

export function update(timeElapsed) {
    const radius = rVar.eval();
    orbitBall.radius = radius;

    const angularSpeed = vVar.eval() / radius;
    orbitBall.angle += angularSpeed * timeElapsed;

    world.draw();
}

export function resize() {
    orbitBall.pos = vec(innerWidth / 2, innerHeight / 2);
}

export function stop() {
    world.setdown();
}