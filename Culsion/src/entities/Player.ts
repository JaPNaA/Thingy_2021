import { PrerenderCanvas } from "../engine/PrerenderCanvas";
import { MovingRectangle } from "../engine/util/MovingRectangle";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { resourceFetcher } from "../resources/resourceFetcher";
import { settings } from "../settings";
import { collisions } from "./collisions";
import { Entity } from "./Entity";
import { NPCWithDialog } from "./NPCWithDialog";

export class Player extends Entity {
    public collisionType = collisions.types.moving;
    public rect = new MovingRectangle(296, 200, 32, 32);
    public speed = 300;
    public interactionRange = 50;

    private texture = new PrerenderCanvas(12, 16);
    private interactHintTexture = new PrerenderCanvas(32, 16);
    private interactTarget: NPCWithDialog | null = null;

    constructor() {
        super();

        this.texture.X.fillStyle = "#ff0000";
        this.texture.X.fillRect(0, 0, 12, 16);

        resourceFetcher.fetchImg("assets/img/char/magmaDown.png")
            .then(img => {
                this.texture.clear();
                this.texture.X.drawImage(img, 0, 0)
            });

        this.renderInteractHintTexture();
    }

    public setWorld(world: World): void {
        super.setWorld(world);

        this.world.keyboard.addKeydownHandler(settings.keybindings.select, () => {
            if (this.interactTarget) {
                this.interactTarget.startDialog();
            }
        });
    }

    draw() {
        const X = this.world.canvas.X;
        X.imageSmoothingEnabled = false;
        this.texture.drawToContext(X,
            this.rect.x - this.texture.width * 2 + this.rect.width / 2,
            this.rect.y - this.texture.height * 4 + this.rect.height,
            this.texture.width * 4, this.texture.height * 4
        );

        if (this.interactTarget) {
            this.interactHintTexture.drawToContext(X,
                this.interactTarget.rect.x + this.interactTarget.rect.width,
                this.interactTarget.rect.y +
                (this.interactTarget.rect.height - this.interactHintTexture.height) / 2
            );
        }
    }

    tick() {
        // movement
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

        // interaction hint
        const interactTarget = this.getInteractTarget();
        this.interactTarget = interactTarget;
    }

    private renderInteractHintTexture() {
        const X = this.interactHintTexture.X;
        X.fillStyle = "#ffffff";
        X.strokeStyle = "#000000";
        X.font = "10px Monospace";
        X.textBaseline = "middle";
        X.textAlign = "center";
        X.rect(0, 0, this.interactHintTexture.width, this.interactHintTexture.height);
        X.fill();
        X.stroke();
        X.fillStyle = "#000000";
        X.fillText(
            settings.keybindings.select[0],
            this.interactHintTexture.width / 2, this.interactHintTexture.height / 2
        );
    }

    private getInteractTarget(): NPCWithDialog | null {
        const items = this.world.collisionSystem.getCollisionsWith(new Rectangle(
            this.rect.x - this.interactionRange,
            this.rect.y - this.interactionRange,
            this.rect.width + this.interactionRange * 2,
            this.rect.height + this.interactionRange * 2
        ));

        for (const item of items) {
            if (item.elm instanceof NPCWithDialog && item.elm.canStartDialog()) {
                return item.elm;
            }
        }

        return null;
    }
}
