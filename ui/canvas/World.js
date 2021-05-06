import { Cursor } from "./Cursor.js";

/**
 * @typedef {import("./HitBox.js").HitBox} HitBox
 */

export class World {
    /** @param {import("./Canvas.js").Canvas} canvas */
    constructor(canvas) {
        this.canvas = canvas;

        /** @type {import("./CanvasElm.js").CanvasElm[]} */
        this.elements = [];

        /** @type {HitBox[]} */
        this.hitboxes = [];

        this.cursor = new Cursor();
        this.cursor.setup();

        this.cursor.mouseDown.addHandler(e => this._mousedownHandler(e));
    }

    setdown() {
        this.cursor.setdown();
    }

    /** @param {import("./CanvasElm.js").CanvasElm} elm */
    addElm(elm) {
        this.elements.push(elm);
        elm.setup(this);
    }

    /** @param {HitBox} hitbox */
    addHitbox(hitbox) {
        this.hitboxes.push(hitbox);
    }

    draw() {
        this.canvas.X.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const element of this.elements) {
            element.draw();
        }
    }

    _mousedownHandler(e) {
        for (const hitbox of this.hitboxes) {
            hitbox.tryMousedown(e.clientX, e.clientY);
        }
    }
}