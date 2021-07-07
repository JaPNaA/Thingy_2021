import { Canvas } from "./Canvas";
import { Rectangle } from "./util/Rectangle";
import { World } from "./World";

export class Camera {
    public x: number = 0;
    public y: number = 0;
    public scale: number = 1;

    private canvas: Canvas;
    private following?: Rectangle;

    constructor(world: World) {
        this.canvas = world.canvas;
    }

    public follow(rect: Rectangle) {
        this.following = rect;
    }

    public _applyTransform(context: CanvasRenderingContext2D) {
        context.scale(this.scale, this.scale);
        context.translate(-this.x, -this.y);
    }

    public _update() {
        if (!this.following) { return; }
        this.x = this.following.x + this.following.width / 2 - this.canvas.width / 2;
        this.y = this.following.y + this.following.height / 2 - this.canvas.height / 2;
    }
}
