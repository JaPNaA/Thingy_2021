import { Entity } from "./Entity";

export class NPC extends Entity {
    constructor(public x: number, public y: number) {
        super();
    }

    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#0f0";
        X.fillRect(this.x, this.y, this.rect.width, this.rect.height);
    }
}
