import { PrerenderCanvas } from "../engine/PrerenderCanvas";
import { MovingRectangle } from "../engine/util/MovingRectangle";
import { resourceFetcher } from "../resources/resourceFetcher";
import { settings } from "../settings";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export class Player extends Entity {
    public collisionType = collisions.types.moving;
    public rect = new MovingRectangle(296, 200, 32, 32);
    public speed = 300;

    private texture = new PrerenderCanvas(12, 16);

    constructor() {
        super();

        this.texture.X.fillStyle = "#ff0000";
        this.texture.X.fillRect(0, 0, 12, 16);

        resourceFetcher.fetchImg("assets/img/char/magmaDown.png")
            .then(img => {
                this.texture.clear();
                this.texture.X.drawImage(img, 0, 0)
            });
    }

    draw() {
        const X = this.world.canvas.X;
        this.texture.drawToContext(X,
            this.rect.x - this.texture.width * 2 + this.rect.width / 2,
            this.rect.y - this.texture.height * 4 + this.rect.height,
            this.texture.width * 4, this.texture.height * 4
        );
        // X.fillStyle = "#f00";
        // X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
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

        if (dirX && dirY) {
            dirX *= Math.SQRT1_2;
            dirY *= Math.SQRT1_2;
        }

        this.rect.x += dirX * this.speed * this.world.timeElapsed;
        this.rect.y += dirY * this.speed * this.world.timeElapsed;
    }
}
