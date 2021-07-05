import { settings } from "../settings";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export class Player extends Entity {
    public collisionType = collisions.types.moving;

    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#f00";
        X.fillRect(this.x, this.y, this.width, this.height);

        let dirX = 0;
        let dirY = 0;

        if (this.world.keyboard.isDown(settings.keybindings.moveLeft)) {
            dirX--;
        }
        if (this.world.keyboard.isDown(settings.keybindings.moveRight)) {
            dirX++;
        }
        if (this.world.keyboard.isDown(settings.keybindings.moveDown)) {
            dirY++;
        }
        if (this.world.keyboard.isDown(settings.keybindings.moveUp)) {
            dirY--;
        }

        this.x += dirX * 10;
        this.y += dirY * 10;
    }

    onCollision() {
        console.log("ow!");
    }
}
