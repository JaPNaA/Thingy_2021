import { EventHandler } from "../../utils/EventHandler.js";
import { Vec2 } from "../../utils/vectors.js";

export class Cursor extends Vec2 {
    /** @param {import("../World.js").World} world */
    constructor(world) {
        super(0, 0);
        this.world = world;

        this.down = false;

        this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
        this._mouseDownHandler = this._mouseDownHandler.bind(this);
        this._mouseUpHandler = this._mouseUpHandler.bind(this);

        this.mouseMove = new EventHandler();
        this.mouseUp = new EventHandler();
        this.mouseDown = new EventHandler();

        this.nextMouseUpPromises = [];
    }

    setup() {
        addEventListener("mousemove", this._mouseMoveHandler);
        addEventListener("mousedown", this._mouseDownHandler);
        addEventListener("mouseup", this._mouseUpHandler);
    }

    setdown() {
        removeEventListener("mousemove", this._mouseMoveHandler);
        removeEventListener("mousedown", this._mouseDownHandler);
        removeEventListener("mouseup", this._mouseUpHandler);
    }

    nextMouseUp() {
        return new Promise(res => {
            this.nextMouseUpPromises.push(res);
        });
    }

    /** @param {MouseEvent} e */
    _mouseMoveHandler(e) {
        this.x = (e.clientX + this.world.camera.x) / this.world.camera.zoom;
        this.y = (e.clientY + this.world.camera.y) / this.world.camera.zoom;
        this.mouseMove.dispatch(e);
    }

    _mouseDownHandler(e) {
        this.down = true;
        this.mouseDown.dispatch(e);
    }

    _mouseUpHandler(e) {
        this.down = false;

        for (const nextMouseUpPromise of this.nextMouseUpPromises) {
            nextMouseUpPromise();
        }

        this.nextMouseUpPromises.length = 0;

        this.mouseUp.dispatch(e);
    }
}
