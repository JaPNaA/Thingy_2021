import { VectorLinearInput } from "./VectorLinearInput.js";
import { CanvasElm } from "../../canvas/CanvasElm.js";
import { vec, Vec2 } from "../../../utils/vectors.js";

export class VectorInput extends VectorLinearInput {
    /**
     * @param {Vec2} direction
     * @param {Vec2} tailPos
     */
    constructor(direction, tailPos) {
        super(direction, tailPos);
        this.xInput = new VectorLinearInput(vec(direction.x, 0), tailPos);
        this.yInput = new VectorLinearInput(vec(0, direction.y), tailPos);

        this.xInput.onUserChange.addHandler(() => this.updateValueFromComponentInputs());
        this.yInput.onUserChange.addHandler(() => this.updateValueFromComponentInputs());
    }

    /** @param {import("../World.js").World} world */
    setup(world) {
        super.setup(world);
        this.xInput.setup(world);
        this.yInput.setup(world);
    }

    /**
     * @override
     */
    update() {
        this.xInput.update();
        this.yInput.update();

        if (this.dragging) {
            this.setVec2(this.world.cursor.subtract(this.tailPos));
            this.updateComponentInputsFromValue();
        }
    }

    /**
     * @param {number} value
     * @override
     */
    _inputElmChangeHandler(value) {
        this.setMagnitude(value);
        this.updateComponentInputsFromValue();
        this.onUserChange.dispatch(this.valueVector);
    }

    updateComponentInputsFromValue() {
        this.xInput.setVec2(vec(this.valueVector.x, 0));
        this.yInput.setVec2(vec(0, this.valueVector.y));
        this.onUserChange.dispatch(this.valueVector);
    }
    
    updateValueFromComponentInputs() {
        this.setVec2(vec(
            this.xInput.getVec2().x,
            this.yInput.getVec2().y
        ));
        this.onUserChange.dispatch(this.valueVector);
    }

    /** @param {Vec2} vec2 */
    setTailPos(vec2) {
        super.setTailPos(vec2);
        this.xInput.setTailPos(vec2);
        this.yInput.setTailPos(vec2);
    }

    draw() {
        this.xInput.draw();
        this.yInput.draw();
        super.draw();
    }
}
