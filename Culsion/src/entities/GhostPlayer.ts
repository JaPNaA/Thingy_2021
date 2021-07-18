import { collisions } from "./collisions";
import { Player } from "./Player";

export class GhostPlayer extends Player {
    public collisionType = collisions.types.none;
    public actualSpeed = 1000;

    public tick() {
        this.speed = this.actualSpeed / this.world.camera.scale;
        super.tick();
    }
}
