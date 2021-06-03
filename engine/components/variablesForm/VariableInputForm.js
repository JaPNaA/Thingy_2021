/**
 * @typedef {import("./VariableInput.js").VariableInput} VariableInput
 */

export class VariableInputForm {
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
