import { HTMLCanvasElm } from "../htmlCanvas/HTMLCanvasElm.js";
import { EventHandler } from "/utils/EventHandler.js";
import { InputElm } from "/utils/elements.js";

let xssWarningShown = false;

export class ScalarInputElm extends HTMLCanvasElm {
    constructor() {
        super();
        this.class("LinearVectorInputElm");

        this.append(
            this.inputElm = new InputElm()
        );

        this._lastValue = 0;
        this.setValue(this._lastValue);

        this.focused = false;

        this.onUserChange = new EventHandler();
        this.inputElm.on("change", () => {
            this.inputElm.elm.blur();
            this._inputChangeHandler();
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

        this.inputElm.on("focus", () => this.focused = true);
        this.inputElm.on("blur", () => this.focused = false);
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
        const strValue = this.inputElm.getValue();
        const value = parseFloat(strValue);
        if (isNaN(value) || strValue.match(/[^\d.]/)) {
            try {
                if (strValue.length > 20) {
                    if (!xssWarningShown) {
                        if (confirm("Warning: don't evaluate code you pasted. Press 'cancel' to cancel evaluation.\n(If you didn't paste anything, and this was a false alarm, you may continue.)\nCode you paste into here could be used for an XSS attack.")) {
                            xssWarningShown = true;
                        } else {
                            throw new Error("Canceled evaluation");
                        }
                    }
                }

                // dangerous! could be used for XSS.
                const evalFunc = new Function("pi", "return " + strValue);
                const evalValue = evalFunc(Math.PI);
                if (typeof evalValue === 'number' && !isNaN(evalValue)) {
                    this._userSetValue(evalValue);
                } else {
                    this._resetToLastValue();
                }
            } catch (err) {
                this._resetToLastValue();
            }
        } else {
            this._userSetValue(value);
        }
    }

    _resetToLastValue() {
        this.setValue(this._lastValue);
    }

    _userSetValue(value) {
        this.setValue(value);
        this.onUserChange.dispatch(value);
    }
}
