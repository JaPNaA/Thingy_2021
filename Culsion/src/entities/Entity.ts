import { CanvasElm } from "../engine/CanvasElm";
import { Hitbox } from "../engine/collision/Hitbox";
import { Rectangle } from "../engine/Rectangle";
import { World } from "../engine/World";
import { collisions } from "./collisions";

export abstract class Entity extends CanvasElm implements Rectangle {
    public x: number = 0;
    public y: number = 0;
    public width: number = 24;
    public height: number= 24;
    public collisionType: Symbol = collisions.types.static;

    public setWorld(world: World) {
        super.setWorld(world);
        world.collisionSystem.addHitbox(new Hitbox(this, this));
    }
}
