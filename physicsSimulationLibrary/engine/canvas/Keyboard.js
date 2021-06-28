import { EventHandler } from "../../utils/EventHandler.js"

export class Keyboard {
    constructor() {
        this.keyDownListeners = {};
        this.keyUpListeners = {};

        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);
    }

    setup() {
        addEventListener("keydown", this._keyDownHandler);
        addEventListener("keyup", this._keyUpHandler);
    }

    setdown() {
        removeEventListener("keydown", this._keyDownHandler);
        removeEventListener("keyup", this._keyUpHandler);
    }

    /**
     * @param {number} key
     * @param {function} handler
     */
    addKeyDownListener(key, handler) {
        if (!this.keyDownListeners[key]) {
            this.keyDownListeners[key] = new EventHandler();
        }
        this.keyDownListeners[key].addHandler(handler);
    }

    /**
     * @param {number} key
     * @param {function} handler
     */
    removeKeyDownListener(key, handler) {
        this.keyDownListeners[key].removeHandler(handler);
    }

    /**
     * @param {number} key
     * @param {function} handler
     */
    addKeyUpListener(key, handler) {
        if (!this.keyUpListeners[key]) {
            this.keyUpListeners[key] = new EventHandler();
        }
        this.keyUpListeners[key].addHandler(handler);
    }

    /**
     * @param {number} key
     * @param {function} handler
     */
    removeKeyUpListener(key, handler) {
        this.keyUpListeners[key].removeHandler(handler);
    }

    /** @param {KeyboardEvent} e */
    _keyDownHandler(e) {
        // ignore if user is typing
        if (this._isInputElm(e.target)) { return; }

        if (this.keyDownListeners[e.code]) {
            this.keyDownListeners[e.code].dispatch();
        }
    }

    /** @param {KeyboardEvent} e */
    _keyUpHandler(e) {
        // ignore if user is typing
        if (this._isInputElm(e.target)) { return; }

        if (this.keyUpListeners[e.code]) {
            this.keyUpListeners[e.code].dispatch();
        }
    }

    _isInputElm(elm) {
        return elm.tagName === "INPUT" || elm.tagName === "BUTTON" || elm.tagName === "TEXTAREA";
    }
}
