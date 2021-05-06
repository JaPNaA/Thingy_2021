import { Cursor } from "./Cursor.js";

export class World {
    /** @param {import("./Canvas.js").Canvas} canvas */
    constructor(canvas) {
        this.canvas = canvas;

        /** @type {import("./CanvasElm.js").CanvasElm[]} */
        this.elements = [];

        this.cursor = new Cursor();
        this.cursor.setup();
    }

    setdown() {
        this.cursor.setdown();
    }

    /** @param {import("./CanvasElm.js").CanvasElm} elm */
    addElm(elm) {
        this.elements.push(elm);
        elm.world = this;
    }

    draw() {
        this.canvas.X.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const element of this.elements) {
            element.draw();
        }
    }
}