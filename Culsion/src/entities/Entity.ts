import { CanvasElm } from "../engine/CanvasElm";
import { Hitbox } from "../engine/collision/Hitbox";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { collisions } from "./collisions";

export abstract class Entity extends CanvasElm {
    public rect = new Rectangle(0, 0, 24, 24);
    public collisionType: Symbol = collisions.types.static;

    public setWorld(world: World) {
        super.setWorld(world);
        world.collisionSystem.addHitbox(new Hitbox(this.rect, this));
    }

    public dispose() {
        throw new Error("Not implemented");
    }
}
