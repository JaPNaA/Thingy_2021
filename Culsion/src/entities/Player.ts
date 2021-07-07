import { MovingRectangle } from "../engine/util/MovingRectangle";
import { settings } from "../settings";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export class Player extends Entity {
    public collisionType = collisions.types.moving;
    public rect = new MovingRectangle(500, 500, 24, 24);

    constructor() {
        super();
    }

    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#f00";
        X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    tick() {
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

        this.rect.setLasts();

        this.rect.x += dirX * 10;
        this.rect.y += dirY * 10;
    }
}
