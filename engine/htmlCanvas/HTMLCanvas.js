import { Component } from "../../utils/elements.js";
import { vec, Vec2 } from "../../utils/vectors.js";

/**
 * @typedef {import("./HTMLCanvasElm.js").HTMLCanvasElm} HTMLCanvasElm
 */

export class HTMLCanvas extends Component {
    constructor() {
        super("HTMLCanvas");
        /** @type {HTMLCanvasElm[]} */
        this.elms = [];
        this.displacement = vec(0, 0);
    }

    /** @param {Vec2} displacement */
    setTranslation(displacement) {
        if (this.displacement.isEqual(displacement)) { return; }
        this.displacement = displacement;

        for (const elm of this.elms) {
            elm.setTranslation(displacement);
        }
    }

    /** @param {HTMLCanvasElm} elm */
    addElm(elm) {
        this.elms.push(elm);
        this.elm.append(elm);
    }
}
