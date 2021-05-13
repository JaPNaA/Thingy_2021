import { Cursor } from "./canvas/Cursor.js";
import { Keyboard } from "./canvas/Keyboard.js";
import { Camera } from "./canvas/Camera.js";

/**
 * @typedef {import("./HitBox.js").HitBox} HitBox
 */

export class World {
    /** @param { {
     *   canvas: import("./canvas/Canvas.js").Canvas,
     *   htmlCanvas: import("./htmlCanvas/HTMLCanvas.js").HTMLCanvas
     * } } canvases */
    constructor( { canvas, htmlCanvas } ) {
        this.canvas = canvas;
        this.htmlCanvas = htmlCanvas;

        /** @type {import("./CanvasElm.js").CanvasElm[]} */
        this.elements = [];

        /** @type {HitBox[]} */
        this.hitboxes = [];

        this.keyboard = new Keyboard();
        this.keyboard.setup();

        this.camera = new Camera(this.keyboard);

        this.cursor = new Cursor(this.camera);
        this.cursor.setup();

        this.cursor.mouseDown.addHandler(e => this._mousedownHandler(e));
    }

    setdown() {
        this.cursor.setdown();
        this.keyboard.setdown();
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
        this.canvas.X.save();
        this.canvas.X.translate(-this.camera.x, -this.camera.y);

        this.htmlCanvas.setTranslation(this.camera.scale(-1));

        for (const element of this.elements) {
            element.update();
        }

        for (const element of this.elements) {
            element.draw();
        }

        this.canvas.X.restore();
    }

    _mousedownHandler(e) {
        for (const hitbox of this.hitboxes) {
            hitbox.tryMousedown(e.clientX + this.camera.x, e.clientY + this.camera.y);
        }
    }
}