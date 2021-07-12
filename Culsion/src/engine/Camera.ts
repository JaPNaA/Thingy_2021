import { Canvas } from "./Canvas";
import { Rectangle } from "./util/Rectangle";
import { World } from "./World";

export class Camera {
    public rect = new Rectangle(0, 0, 1, 1);
    public scale: number = 1;

    private canvas: Canvas;
    private following?: Rectangle;

    constructor(world: World) {
        this.canvas = world.canvas;
    }

    public follow(rect: Rectangle) {
        this.following = rect;
    }

    public clientXToWorld(x: number) {
        return this.rect.x + x / this.scale;
    }

    public clientYToWorld(y: number) {
        return this.rect.y + y / this.scale;
    }

    public _applyTransform(context: CanvasRenderingContext2D) {
        context.scale(this.scale, this.scale);
        context.translate(-this.rect.x, -this.rect.y);
    }

    public _update() {
        this.rect.width = this.canvas.width;
        this.rect.height = this.canvas.height;

        if (!this.following) { return; }
        this.rect.x = this.following.x + this.following.width / 2 - this.rect.width / 2 / this.scale;
        this.rect.y = this.following.y + this.following.height / 2 - this.rect.height / 2 / this.scale;
    }
}
