import { vec, Vec2 } from "../../../utils/vectors.js";
import { CanvasElm } from "../../canvas/CanvasElm.js";
import { HitBox } from "../../canvas/HitBox.js";
import { EventHandler } from "../../../utils/EventHandler.js";
import { ScalarInputElm } from "../ScalarInputElm.js";
import { VectorArrow } from "../vectorArrow/VectorArrow.js";

export class VectorLinearInput extends CanvasElm {
    /**
     * @param {Vec2} direction
     * @param {Vec2} tailPos
     */
    constructor(direction, tailPos) {
        super();
        this.staticPosition = true;

        this.direction = direction;
        this.magnitude = this.direction.magnitude;
        this.tailPos = tailPos;
        this.valueVector = this.direction;

        this.vectorArrow = new VectorArrow(tailPos, direction);

        this.hidden = false;
        this.dragging = false;
        this.hovering = false;

        this.hitboxSize = vec(8, 8);
        this.hitbox = new HitBox(this._getHitboxCorner(1), this.hitboxSize);
        this.hitbox.setMousedownHandler(() => this._mousedownHandler());
        this.hitbox.setMousemoveHandler(() => this.hovering = true);
        this.hitbox.setMouseoffHandler(() => this.hovering = false);

        this.inputElm = new ScalarInputElm();
        this.inputElm.onUserChange.addHandler(value => this._inputElmChangeHandler(value));

        this.onUserChange = new EventHandler();
        this.updateValueVectorDependencies();
    }

    /** @param {import("./World.js").World} Lorld */
    setup(world) {
        super.setup(world);
        world.addHitbox(this.hitbox);
        world.htmlCanvas.addElm(this.inputElm);
        this.vectorArrow.setup(world);
    }

    setdown() {
        super.setdown();
        this.world.removeHitbox(this.hitbox);
        this.world.htmlCanvas.removeElm(this.inputElm);
        this.vectorArrow.setdown(this.world);
    }

    update() {
        if (!this.dragging) { return; }
        this.setMagnitude(
            this.world.cursor.subtract(this.tailPos).dot(this.direction) / this.direction.magnitude
        );
        this.onUserChange.dispatch(this.valueVector);
    }

    draw() {
        if (this.hidden) { return; }
        const canvas = this.world.canvas;
        const invCameraScale = 1 / this.world.camera.zoom;

        this.vectorArrow.setTailHighlighted(this.dragging || this.hovering);
        this.vectorArrow.draw();

        this.inputElm.setPos(this.tailPos.add(this.valueVector.scale(1 / 2)));

        this.hitbox.setPos(this._getHitboxCorner(invCameraScale));
        this.hitbox.setDim(this.hitboxSize.scale(invCameraScale));
    }

    updateValueVectorDependencies() {
        this.inputElm.setValue(this.magnitude);
        this.vectorArrow.setValue(this.valueVector);
    }

    getTailPos() {
        return this.tailPos;
    }

    /** @param {Vec2} vec2 */
    setTailPos(vec2) {
        this.tailPos = vec2;
        this.vectorArrow.setTail(vec2);
    }

    getVec2() {
        return this.direction.withMagnitude(this.magnitude);
    }

    /** @param {Vec2} vec2 */
    setVec2(vec2) {
        this.direction = vec2;
        this.magnitude = vec2.magnitude;
        this.valueVector = vec2;
        this.updateValueVectorDependencies();
    }

    getMagnitude() {
        return this.magnitude;
    }

    setMagnitude(magnitude) {
        this.magnitude = magnitude;
        this.valueVector = this.getVec2();
        this.updateValueVectorDependencies();
    }

    /** @param {string} unitStr */
    setUnitText(unitStr) {
        this.inputElm.addTextAfter(unitStr);
    }

    /** @param {string} varName */
    setVariableName(varName) {
        this.inputElm.addTextBefore(varName + " =");
    }

    hide() {
        this.hitbox.disable();
        this.inputElm.hide();
        this.hidden = true;
    }

    show() {
        this.hitbox.enable();
        this.inputElm.show();
        this.hidden = false;
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

    _getHitboxCorner(invCameraScale) {
        return this.tailPos.add(this.valueVector).subtract(this.hitboxSize.scale(invCameraScale / 2));
    }
}
