import { vec, Vec2 } from "../../../utils/vectors.js";
import { CanvasElm } from "../CanvasElm.js";

export class VectorLinearInput extends CanvasElm {
    /**
     * @param {Vec2} direction
     * @param {Vec2} tailPos
     */
    constructor(direction, tailPos) {
        super();
        this.magnitude = 0;
        this.direction = direction;
        this.tailPos = tailPos;
        this.valueVector = this.direction;
    }

    draw() {
        this.magnitude = this.world.cursor.x;
        this.valueVector = this.getVec2();

        const canvas = this.world.canvas;
        const headX = this.tailPos.x + this.valueVector.x;
        const headY = this.tailPos.y + this.valueVector.y;

        canvas.X.strokeStyle = "#ffffff";
        canvas.X.fillStyle = "#ff0000";
        canvas.X.beginPath();
        canvas.X.moveTo(this.tailPos.x, this.tailPos.y);
        canvas.X.lineTo(headX, headY);
        canvas.X.stroke();
        canvas.X.fillRect(headX - 2, headY - 2, 4, 4);
    }

    getVec2() {
        return this.direction.withMagnitude(this.magnitude);
    }
}