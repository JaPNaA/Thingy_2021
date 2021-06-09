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
        this.inputElm.on("change", () => {
            this._inputChangeHandler();
            this.inputElm.elm.blur();
        });

        this.inputElm.on("keydown", e => {
            if (e.key === "ArrowUp") {
                this.setValue(this._lastValue + 1);
                this._inputChangeHandler();
            } else if (e.key === "ArrowDown") {
                this.setValue(this._lastValue - 1);
                this._inputChangeHandler();
            }
        });
    }

    /** @param {number} value */
    setValue(value) {
        const strValue = value.toFixed(2);
        this.inputElm.setValue(strValue);
        this.inputElm.attribute("style", "width: " + strValue.length + "ch");
        this._lastValue = value;
    }

    getValue() {
        return this._lastValue;
    }

    addTextBefore(text) {
        this.appendAsFirst(text);
    }

    addTextAfter(after) {
        this.append(after);
    }

    _inputChangeHandler() {
        const value = parseFloat(this.inputElm.getValue());
        if (isNaN(value)) {
            this.setValue(this._lastValue);
            return;
        }

        this.setValue(value);
        this.onUserChange.dispatch(value);
    }
}
