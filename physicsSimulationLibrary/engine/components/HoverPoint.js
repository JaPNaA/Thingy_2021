import { vec } from "../../utils/vectors.js";
import { CanvasElm } from "../canvas/CanvasElm.js";
import { HitBox } from "../canvas/HitBox.js";

export class HoverPoint extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;
        
        this.offset = vec(0, 0);
        this.pos = vec(0, 0);

        this.hovering = false;

        this.hitbox = new HitBox(this._getHitboxCorner(), vec(8, 8));
        this.hitbox.setMousemoveHandler(() => this.hovering = true);
        this.hitbox.setMouseoffHandler(() => this.hovering = false);
    }

    setup(world) {
        super.setup(world);
        world.addHitbox(this.hitbox);
    }

    draw() {
        const X = this.world.canvas.X;

        const {x, y} = this.world.camera.transformPoint(this.pos.add(this.offset));

        X.fillStyle = "#ff0000";

        X.beginPath();
        X.arc(x, y, 4, 0, 2 * Math.PI);
        X.closePath();
        X.fill();

        this.hitbox.setPos(this._getHitboxCorner());

        if (this.hovering) {
            X.fillText(this.pos.toString(2), x, y);
        }
    }

    _getHitboxCorner() {
        return this.pos.add(this.offset).subtract(vec(4, 4));
    }
}
