import { CanvasElm } from "../engine/CanvasElm";
import { Hitbox } from "../engine/collision/Hitbox";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { collisions } from "./collisions";

export abstract class Entity extends CanvasElm {
    public rect = new Rectangle(0, 0, 24, 24);
    public collisionType: Symbol = collisions.types.static;

    private hitbox!: Hitbox<Entity>;

    public setWorld(world: World) {
        super.setWorld(world);
        this.hitbox = new Hitbox(this.rect, this);
        world.collisionSystem.addHitbox(this.hitbox);
    }

    public dispose() {
        this.world.collisionSystem.removeHitbox(this.hitbox);
    }
}
