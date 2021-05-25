import { HTMLCanvasElm } from "../htmlCanvas/HTMLCanvasElm.js";
import { EventHandler } from "/utils/EventHandler.js";
import { InputElm } from "/utils/elements.js";

export class ScalarInputElm extends HTMLCanvasElm {
    constructor() {
        super();
        this.class("LinearVectorInputElm");

        this.append(
            this.inputElm = new InputElm()
        );

        this._lastValue = 0;
        this.setValue(this._lastValue);

        this.onUserChange = new EventHandler();
        this.inputElm.on("change", () => this._inputChangeHandler());
    }

    /** @param {number} value */
    setValue(value) {
        const strValue = value.toFixed(2);
        this.inputElm.setValue(strValue);
        this.inputElm.attribute("style", "width: " + strValue.length + "ch");
        this._lastValue = value;
    }

    _inputChangeHandler() {
        const value = parseFloat(this.inputElm.getValue());
        if (isNaN(value)) {
            this.setValue(this._lastValue);
            return;
        }

        this.setValue(value);
        this.onUserChange.dispatch(value);

        this.inputElm.elm.blur();
    }
}
