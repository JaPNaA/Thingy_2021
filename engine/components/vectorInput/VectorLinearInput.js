import { vec, Vec2 } from "../../../utils/vectors.js";
import { CanvasElm } from "../../canvas/CanvasElm.js";
import { HitBox } from "../../canvas/HitBox.js";
import { HTMLCanvasElm } from "../../htmlCanvas/HTMLCanvasElm.js";
import { Elm, InputElm } from "../../../utils/elements.js";
import { EventHandler } from "../../../utils/EventHandler.js";

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

        this.inputElm = new LinearVectorInputElm();
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
        canvas.X.fillStyle = (this.hovering || this.dragging) ? "#ff0000" : "#aaaaaa";
        canvas.X.beginPath();
        canvas.X.moveTo(this.tailPos.x, this.tailPos.y);
        canvas.X.lineTo(headPos.x, headPos.y);
        canvas.X.stroke();
        canvas.X.fillRect(headPos.x - 2, headPos.y - 2, 4, 4);

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

class LinearVectorInputElm extends HTMLCanvasElm {
    constructor() {
        super();
        this.class("LinearVectorInputElm");

        this.append(
            this.inputElm = new InputElm()
        );

        this._lastValue = "";

        this.onUserChange = new EventHandler();
        this.inputElm.on("change", () => this._inputChangeHandler());
    }

    /** @param {number} value */
    setValue(value) {
        const strValue = value.toFixed(2);
        this.inputElm.setValue(strValue);
        this.inputElm.attribute("style", "width: " + strValue.length + "ch");
        this._lastValue = value;
    }

    _inputChangeHandler() {
        const value = parseFloat(this.inputElm.getValue());
        if (isNaN(value)) {
            this.setValue(this._lastValue);
            return;
        }

        this.onUserChange.dispatch(value);
    }
}
