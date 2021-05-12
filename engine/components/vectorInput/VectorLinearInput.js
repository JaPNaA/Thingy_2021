import { vec, Vec2 } from "../../../utils/vectors.js";
import { CanvasElm } from "../../canvas/CanvasElm.js";
import { HitBox } from "../../canvas/HitBox.js";
import { HTMLCanvasElm } from "../../htmlCanvas/HTMLCanvasElm.js";
import { Elm, InputElm } from "../../../utils/elements.js";

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

        this.hitbox = new HitBox(this._getHitboxCorner(), vec(4, 4));
        this.hitbox.setMousedownHandler(() => this._mousedownHandler());

        this.inputElm = new LinearVectorInputElm();
    }

    /** @param {import("./World.js").World} Lorld */
    setup(world) {
        super.setup(world);
        world.addHitbox(this.hitbox);
        world.htmlCanvas.addElm(this.inputElm);
    }

    update() {
        if (this.dragging) {
            this.setMagnitude(
                this.world.cursor.subtract(this.tailPos).dot(this.direction) / this.direction.magnitude
            );
        }
        this.inputElm.setValue(this.magnitude);
    }

    draw() {
        const canvas = this.world.canvas;
        const headPos = this.tailPos.add(this.valueVector);

        canvas.X.strokeStyle = "#ffffff";
        canvas.X.fillStyle = "#ff0000";
        canvas.X.beginPath();
        canvas.X.moveTo(this.tailPos.x, this.tailPos.y);
        canvas.X.lineTo(headPos.x, headPos.y);
        canvas.X.stroke();
        canvas.X.fillRect(headPos.x - 2, headPos.y - 2, 4, 4);

        this.inputElm.setPos(headPos.add(this.tailPos).scale(1/2));

        this.hitbox.setPos(this._getHitboxCorner());
    }

    getVec2() {
        return this.direction.withMagnitude(this.magnitude);
    }

    /** @param {Vec2} vec2 */
    setVec2(vec2) {
        this.direction = vec2;
        this.magnitude = vec2.magnitude;
        this.valueVector = vec2;
    }

    getMagnitude() {
        return this.magnitude;
    }

    setMagnitude(magnitude) {
        this.magnitude = magnitude;
        this.valueVector = this.getVec2();
    }

    _mousedownHandler() {
        this.dragging = true;
        this.world.cursor.nextMouseUp().then(() => this.dragging = false);
    }

    _getHitboxCorner() {
        return this.tailPos.add(this.valueVector).subtract(vec(2, 2));
    }
}

class LinearVectorInputElm extends HTMLCanvasElm {
    constructor() {
        super();
        this.class("LinearVectorInputElm");
        this.append(
            this.inputElm = new InputElm()
        );
    }

    /** @param {number} value */
    setValue(value) {
        const strValue = value.toFixed(2);
        this.inputElm.setValue(strValue);
        this.inputElm.attribute("style", "width: " + strValue.length + "ch");
    }
}
