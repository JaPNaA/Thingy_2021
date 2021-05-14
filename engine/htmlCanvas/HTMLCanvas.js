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
        this.scale = 0;
    }

    /** @param {Vec2} displacement */
    setTransformation(displacement, scale) {
        if (this.displacement.isEqual(displacement) && this.scale === scale) { return; }
        this.displacement = displacement;
        this.scale = scale;

        for (const elm of this.elms) {
            elm.setTransformation(displacement, scale);
        }
    }

    /** @param {HTMLCanvasElm} elm */
    addElm(elm) {
        this.elms.push(elm);
        this.elm.append(elm);
    }
}
