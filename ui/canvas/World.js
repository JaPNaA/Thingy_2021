import { Cursor } from "./Cursor.js";
import { Keyboard } from "./Keyboard.js";
import { Camera } from "./Camera.js";

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