import { Variable } from "/utils/mathLib.js";
import { VariableInputForm } from "./VariableInputForm.js";
import { VariableInput } from "./VariableInput.js";

export class ExpressionSolver {
    /** @param { {
     *   variables: (string | [string, number])[],
     *   expression: (vars: { [x: string]: Variable }) => import("/utils/mathLib.js").Expression
     * } } params */
    constructor( { variables, expression } ) {
        this._variablesList = [];

        this.variables = this._initVariables(variables);
        this.expression = expression(this.variables);
    }

    addFormToWorld(world) {
        const variableInputForm = new VariableInputForm();

        for (const variableName of this._variablesList) {
            const variableInput = new VariableInput(this.variables[variableName]);
            variableInputForm.addVariableInput(variableInput);
            world.addElm(variableInput);
        }

        variableInputForm.trySolve();
    }

    /**
     * @param {(string | [string, number])[]} variables
     */
    _initVariables(variables) {
        const obj = {};

        for (const variable of variables) {
            if (Array.isArray(variable)) {
                const [name, initialValue] = variable;
                obj[name] = new Variable(name);
                obj[name].setKnownValue(initialValue);
                this._variablesList.push(name);
            } else {
                obj[variable] = new Variable(variable);
                this._variablesList.push(variable);
            }
        }

        return obj;
    }
}
