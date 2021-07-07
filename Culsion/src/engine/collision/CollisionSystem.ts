import { CollisionReactionMap } from "./CollisionReactionMap";
import { Hitbox } from "./Hitbox";
import { isRectanglesColliding } from "./isRectanglesColliding";

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

                if (isRectanglesColliding(rect1, rect2)) {
                    this.reactions.triggerReaction(this.hitboxes[i], this.hitboxes[j]);
                }
            }
        }
    }
}
