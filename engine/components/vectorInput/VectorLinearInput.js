import { vec, Vec2 } from "../../../utils/vectors.js";
import { CanvasElm } from "../../canvas/CanvasElm.js";
import { HitBox } from "../../canvas/HitBox.js";
import { EventHandler } from "../../../utils/EventHandler.js";
import { ScalarInputElm } from "../ScalarInputElm.js";

export class VectorLinearInput extends CanvasElm {
    /**
     * @param {Vec2} direction
     * @param {Vec2} tailPos
     */
    constructor(direction, tailPos) {
        super();
        this.direction = direction;
        this.magnitude = this.direction.magnitude;
        this.tailPos = tailPos;
        this.valueVector = this.direction;

        this.dragging = false;
        this.hovering = false;

        this.hitbox = new HitBox(this._getHitboxCorner(), vec(8, 8));
        this.hitbox.setMousedownHandler(() => this._mousedownHandler());
        this.hitbox.setMousemoveHandler(() => this.hovering = true);
        this.hitbox.setMouseoffHandler(() => this.hovering = false);

        this.inputElm = new ScalarInputElm();
        this.inputElm.onUserChange.addHandler(value => this._inputElmChangeHandler(value));

        this.onUserChange = new EventHandler();
        this.updateInputValue();
    }

    /** @param {import("./World.js").World} Lorld */
    setup(world) {
        super.setup(world);
        world.addHitbox(this.hitbox);
        world.htmlCanvas.addElm(this.inputElm);
    }

    update() {
        if (!this.dragging) { return; }
        this.setMagnitude(
            this.world.cursor.subtract(this.tailPos).dot(this.direction) / this.direction.magnitude
        );
        this.onUserChange.dispatch(this.valueVector);
    }

    draw() {
        const canvas = this.world.canvas;
        const headPos = this.tailPos.add(this.valueVector);

        canvas.X.strokeStyle = "#ffffff";
        canvas.X.lineWidth = 1 / this.world.camera.zoom;
        canvas.X.fillStyle = (this.hovering || this.dragging) ? "#ff0000" : "#aaaaaa";
        canvas.X.beginPath();
        canvas.X.moveTo(this.tailPos.x, this.tailPos.y);
        canvas.X.lineTo(headPos.x, headPos.y);
        canvas.X.stroke();
        canvas.X.fillRect(
            headPos.x - 2 / this.world.camera.zoom,
            headPos.y - 2 / this.world.camera.zoom,
            4 / this.world.camera.zoom,
            4 / this.world.camera.zoom
        );

        this.inputElm.setPos(headPos.add(this.tailPos).scale(1/2));

        this.hitbox.setPos(this._getHitboxCorner());
    }

    updateInputValue() {
        this.inputElm.setValue(this.magnitude);
    }

    getTailPos() {
        return this.tailPos;
    }

    /** @param {Vec2} vec2 */
    setTailPos(vec2) {
        this.tailPos = vec2;
    }

    getVec2() {
        return this.direction.withMagnitude(this.magnitude);
    }

    /** @param {Vec2} vec2 */
    setVec2(vec2) {
        this.direction = vec2;
        this.magnitude = vec2.magnitude;
        this.valueVector = vec2;
        this.updateInputValue();
    }

    getMagnitude() {
        return this.magnitude;
    }

    setMagnitude(magnitude) {
        this.magnitude = magnitude;
        this.valueVector = this.getVec2();
        this.updateInputValue();
    }

    /** @param {number} value */
    _inputElmChangeHandler(value) {
        this.setMagnitude(value);
        this.onUserChange.dispatch(this.valueVector);
    }

    _mousedownHandler() {
        this.dragging = true;
        this.world.cursor.nextMouseUp().then(() => this.dragging = false);
    }

    _getHitboxCorner() {
        return this.tailPos.add(this.valueVector).subtract(vec(4, 4));
    }
}
