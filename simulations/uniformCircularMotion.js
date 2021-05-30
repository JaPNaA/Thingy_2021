import { World } from "../engine/World.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { InputElm } from "../utils/elements.js";
import { Variable, Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";

class VariableInput extends ScalarInputElm {
    /** @param {Variable} variable */
    constructor(variable) {
        super();
        this.staticPosition = true;
        this.variable = variable;

        this.addTextBefore(variable.toString() + " = ");
    }

    /** @override */
    setValue(val) {
        super.setValue(val);
        if (this.variable) {
            this.variable.setKnownValue(val);
        }
    }
}

class VariableInputForm {
    constructor() {
        this.variableInputs = [];

        /**
         * Variable inputs sorted by time edited. Latest edited last.
         * @type {VariableInput[]}
         */
        this.inputsByLastEdited = [];
    }

    addVariableInput(input) {
        this.variableInputs.push(input);
        input.onUserChange.addHandler(() => {
            this._updateInputLastEdited(input);
            this.trySolve();
        });
    }

    trySolve() {
        const targetInput = this._getLeastLikelyUsedInput();
        const expression = targetInput.variable.solveForSelf();
        try {
            targetInput.setValue(expression.eval());
        } catch (err) { console.log(err); }
    }

    _updateInputLastEdited(input) {
        const lastIndex = this.inputsByLastEdited.indexOf(input);
        if (lastIndex >= 0) {
            this.inputsByLastEdited.splice(lastIndex, 1);
        }
        
        this.inputsByLastEdited.push(input);
    }

    /** @returns {VariableInput} */
    _getLeastLikelyUsedInput() {
        const unedited = this.variableInputs.find(input => !this.inputsByLastEdited.includes(input));
        if (unedited) { return unedited; }
        return this.inputsByLastEdited[0];
    }
}

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

        X.beginPath();
        X.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        X.stroke();

        const ballPos = Vec2.fromPolar(this.radius, this.angle).add(this.pos);

        X.beginPath();
        X.arc(ballPos.x, ballPos.y, 4, 0, Math.PI * 2);
        X.fill();
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

export function update() {
    orbitBall.radius = rVar.value;

    world.draw();
}

export function resize() {
    orbitBall.pos = vec(innerWidth / 2, innerHeight / 2);
}

export function stop() {
    world.setdown();
}