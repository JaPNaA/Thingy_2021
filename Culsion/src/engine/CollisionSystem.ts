import { Rectangle } from "./Rectangle";

export class CollisionSystem {
    private hitboxes: Rectangle[] = [];

    public addHitbox(rectangle: Rectangle) {
        this.hitboxes.push(rectangle);
    }

    public _checkCollisions() {
        const numHitboxes = this.hitboxes.length;

        for (let i = 0; i < numHitboxes; i++) {
            for (let j = i + 1; j < numHitboxes; j++) {
                if (
                    this.hitboxes[i].x < this.hitboxes[j].x + this.hitboxes[j].width &&
                    this.hitboxes[i].x + this.hitboxes[i].width > this.hitboxes[j].x &&
                    this.hitboxes[i].y < this.hitboxes[j].y + this.hitboxes[j].height &&
                    this.hitboxes[i].y + this.hitboxes[i].height > this.hitboxes[j].y
                ) {
                    console.log("collision");
                }
            }
        }
    }
}
