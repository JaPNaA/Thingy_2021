import { VectorLinearInput } from "./VectorLinearInput.js";
import { CanvasElm } from "../../canvas/CanvasElm.js";
import { vec, Vec2 } from "../../../utils/vectors.js";
import { HitBox } from "../../canvas/HitBox.js";

export class VectorInput extends VectorLinearInput {
    /**
     * @param {Vec2} direction
     * @param {Vec2} tailPos
     */
    constructor(direction, tailPos) {
        super(direction, tailPos);
        this.xInput = new VectorLinearInput(vec(direction.x, 0), tailPos);
        this.yInput = new VectorLinearInput(vec(0, direction.y), tailPos);

        this.isHidingComponents = true;

        this.bigHitbox = new HitBox(this.getTailPos(), this.getVec2(), 8);
        this.bigHitbox.mousemoveHandler = () => this._showComponents();
        this.bigHitbox.mouseoffHandler = () => this._hideComponents();

        this.xInput.onUserChange.addHandler(() => this._updateValueFromComponentInputs());
        this.yInput.onUserChange.addHandler(() => this._updateValueFromComponentInputs());
    }

    /** @param {import("../World.js").World} world */
    setup(world) {
        super.setup(world);
        world.addHitbox(this.bigHitbox);

        this.xInput.setup(world);
        this.yInput.setup(world);
        this.xInput.hide();
        this.yInput.hide();
    }

    setdown() {
        super.setdown();

        this.xInput.setdown(this.world);
        this.yInput.setdown(this.world);
    }

    /**
     * @override
     */
    update() {
        if (!this.isHidingComponents) {
            this.xInput.update();
            this.yInput.update();
        }

        if (this.dragging) {
            const newValue = this.world.cursor.subtract(this.tailPos);
            this.setVec2(newValue);
            this.bigHitbox.setDim(newValue);
            this._updateComponentInputsFromValue();
        }
    }

    draw() {
        if (!this.isHidingComponents) {
            this.xInput.draw();
            this.yInput.draw();
        }

        super.draw();
    }

    /** @param {string} unitStr */
    setUnitText(unitStr) {
        super.setUnitText(unitStr);
        this.xInput.setUnitText(unitStr);
        this.yInput.setUnitText(unitStr);
    }

    /** @param {Vec2} vec2 */
    setTailPos(vec2) {
        super.setTailPos(vec2);
        this.xInput.setTailPos(vec2);
        this.yInput.setTailPos(vec2);
        this.bigHitbox.setPos(vec2);
    }

    _hideComponents() {
        // Todo: letting go while outside of hitbox doesn't hide components
        if (this.xInput.dragging || this.yInput.dragging) { return; }
        this.isHidingComponents = true;
        this.xInput.hide();
        this.yInput.hide();
    }

    _showComponents() {
        this.isHidingComponents = false;
        this.xInput.show();
        this.yInput.show();
    }

    /**
     * @param {number} value
     * @override
     */
    _inputElmChangeHandler(value) {
        this.setMagnitude(value);
        this._updateComponentInputsFromValue();
        this.onUserChange.dispatch(this.valueVector);
    }

    _updateComponentInputsFromValue() {
        this.xInput.setVec2(vec(this.valueVector.x, 0));
        this.yInput.setVec2(vec(0, this.valueVector.y));
        this.onUserChange.dispatch(this.valueVector);
    }
    
    _updateValueFromComponentInputs() {
        const newValue = vec(
            this.xInput.getVec2().x,
            this.yInput.getVec2().y
        );
        this.setVec2(newValue);
        this.bigHitbox.setDim(newValue);
        this.onUserChange.dispatch(this.valueVector);
    }
}
