import { vec, Vec2 } from "../../../utils/vectors.js";
import { CanvasElm } from "../CanvasElm.js";
import { HitBox } from "../HitBox.js";

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

        this.dragging = false;

        this.hitbox = new HitBox(this._getHitboxCorner(), vec(4, 4));
        this.hitbox.setMousedownHandler(() => this.mousedownHandler());
    }

    /** @param {import("./World.js").World} world */
    setup(world) {
        super.setup(world);
        world.addHitbox(this.hitbox);
    }

    draw() {
        if (this.dragging) {
            this.magnitude = this.world.cursor.subtract(this.tailPos).dot(this.direction) / this.direction.magnitude; 
            this.valueVector = this.getVec2();
        }

        const canvas = this.world.canvas;
        const headPos = this.tailPos.add(this.valueVector);

        canvas.X.strokeStyle = "#ffffff";
        canvas.X.fillStyle = "#ff0000";
        canvas.X.beginPath();
        canvas.X.moveTo(this.tailPos.x, this.tailPos.y);
        canvas.X.lineTo(headPos.x, headPos.y);
        canvas.X.stroke();
        canvas.X.fillRect(headPos.x - 2, headPos.y - 2, 4, 4);

        this.hitbox.setPos(this._getHitboxCorner());
    }

    mousedownHandler() {
        this.dragging = true;
        this.world.cursor.nextMouseUp().then(() => this.dragging = false);
    }

    getVec2() {
        return this.direction.withMagnitude(this.magnitude);
    }

    _getHitboxCorner() {
        return this.tailPos.add(this.valueVector).subtract(vec(2, 2));
    }
}