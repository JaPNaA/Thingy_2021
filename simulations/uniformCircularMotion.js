import { World } from "../engine/World.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { InputElm } from "../utils/elements.js";
import { Variable, Expression } from "../utils/mathLib.js";

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
            this._trySolve();
        });
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

    _trySolve() {
        const targetInput = this._getLeastLikelyUsedInput();
        const expression = targetInput.variable.solveForSelf();
        try {
            targetInput.setValue(expression.eval());
        } catch (err) { }
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

let world;

export function start(simulationView) {
    world = new World(simulationView);

    for (const variable of [vVar, aVar, rVar]) {
        const variableInput = new VariableInput(variable);
        variableInputForm.addVariableInput(variableInput);
        world.addElm(variableInput);
    }
}

export function update() {
    world.draw();
}

export function stop() {
    world.setdown();
}