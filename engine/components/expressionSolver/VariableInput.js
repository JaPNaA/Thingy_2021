import { ScalarInputElm } from "../ScalarInputElm.js";

export class VariableInput extends ScalarInputElm {
    /** @param {Variable} variable */
    constructor(variable) {
        super();
        this.staticPosition = true;
        this.variable = variable;

        this.addTextBefore(variable.name + " = ");
    }

    /** @override */
    setValue(val) {
        super.setValue(val);
        if (this.variable) {
            this.variable.setKnownValue(val);
        }
    }
}
