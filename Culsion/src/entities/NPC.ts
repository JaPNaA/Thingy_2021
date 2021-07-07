import { Entity } from "./Entity";

export class NPC extends Entity {
    constructor(x: number, y: number) {
        super();
        this.rect.x = x;
        this.rect.y = y;
    }

    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#0f0";
        X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}
