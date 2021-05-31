import { Cursor } from "./canvas/Cursor.js";
import { Keyboard } from "./canvas/Keyboard.js";
import { Camera } from "./canvas/Camera.js";
import { HTMLCanvasElm } from "./htmlCanvas/HTMLCanvasElm.js";

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
        this._debugDrawHitbox = false;

        this.keyboard = new Keyboard();
        this.keyboard.setup();

        this.cursor = new Cursor(this);
        this.cursor.setup();

        this.camera = new Camera(this);

        this.cursor.mouseDown.addHandler(e => this._mousedownHandler(e));
        this.cursor.mouseMove.addHandler(e => this._mousemoveHandler(e));
    }

    setdown() {
        this.cursor.setdown();
        this.keyboard.setdown();
    }

    /** @param {(import("./canvas/CanvasElm.js").CanvasElm | HTMLCanvasElm)[]} ...elm */
    addElm(...elms) {
        for (const elm of elms) {
            if (elm instanceof HTMLCanvasElm) {
                this.htmlCanvas.addElm(elm);
            } else {
                this.elements.push(elm);
                elm.setup(this);
            }
        }
    }

    /** @param {HitBox} hitbox */
    addHitbox(hitbox) {
        this.hitboxes.push(hitbox);
    }

    draw() {
        this.canvas.X.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.X.save();
        this.canvas.X.translate(-this.camera.x, -this.camera.y);
        this.canvas.X.scale(this.camera.zoom, this.camera.zoom);

        this.htmlCanvas.setTransformation(this.camera.scale(-1), this.camera.zoom);

        for (const element of this.elements) {
            element.update();
        }

        for (const element of this.elements) {
            element.draw();
        }

        if (this._debugDrawHitbox) {
            this._debugDrawHitboxes();
        }

        this.canvas.X.restore();
    }

    _debugDrawHitboxes() {
        this.canvas.X.fillStyle = "#4444ff20";
        this.canvas.X.strokeStyle = "#4444ff";
        for (const hitbox of this.hitboxes) {
            this.canvas.X.beginPath();
            this.canvas.X.rect(hitbox.pos.x, hitbox.pos.y, hitbox.dim.x, hitbox.dim.y);
            this.canvas.X.fill();
            this.canvas.X.stroke();
        }
    }

    _mousedownHandler(e) {
        for (const hitbox of this.hitboxes) {
            hitbox.tryMousedown(this.cursor.x, this.cursor.y);
        }
    }

    _mousemoveHandler(e) {
        for (const hitbox of this.hitboxes) {
            hitbox.tryMousemove(this.cursor.x, this.cursor.y);
        }
    }
}