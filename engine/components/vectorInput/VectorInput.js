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

        if (this.xInput.dragging || this.yInput.dragging) {
            this.setVec2(vec(
                this.xInput.getVec2().x,
                this.yInput.getVec2().y
            ));
        } else if (this.dragging) {
            this.setVec2(this.world.cursor.subtract(this.tailPos));
            this.xInput.setVec2(vec(this.direction.x, 0));
            this.yInput.setVec2(vec(0, this.direction.y));
        }
        
        this.inputElm.setValue(this.magnitude);
    }

    draw() {
        this.xInput.draw();
        this.yInput.draw();
        super.draw();
    }
}
