import { CollisionReactionMap } from "./CollisionReactionMap";
import { Hitbox } from "./Hitbox";

export class CollisionSystem {
    public reactions = new CollisionReactionMap();

    private hitboxes: Hitbox<any>[] = [];

    public addHitbox(rectangle: Hitbox<any>) {
        this.hitboxes.push(rectangle);
    }

    public _checkCollisions() {
        const numHitboxes = this.hitboxes.length;

        for (let i = 0; i < numHitboxes; i++) {
            const rect1 = this.hitboxes[i].rectangle;

            for (let j = i + 1; j < numHitboxes; j++) {
                const rect2 = this.hitboxes[j].rectangle;

                if (
                    rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y
                ) {
                    this.reactions.triggerReaction(this.hitboxes[i], this.hitboxes[j]);
                }
            }
        }
    }
}
