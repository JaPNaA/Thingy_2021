import { Component } from "../../utils/elements.js";

/**
 * @typedef {import("./HTMLCanvasElm.js").HTMLCanvasElm} HTMLCanvasElm
 */

export class HTMLCanvas extends Component {
    constructor() {
        super("HTMLCanvas");
        /** @type {HTMLCanvasElm[]} */
        this.elms = [];
    }

    /** @param {HTMLCanvasElm} elm */
    addElm(elm) {
        this.elms.push(elm);
        this.elm.append(elm);
    }
}
