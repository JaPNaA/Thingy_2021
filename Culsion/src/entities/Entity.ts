import { CanvasElm } from "../engine/CanvasElm";
import { Rectangle } from "../engine/Rectangle";
import { World } from "../engine/World";

export abstract class Entity extends CanvasElm implements Rectangle {
    public x: number = 0;
    public y: number = 0;
    public width: number = 24;
    public height: number= 24;

    public setWorld(world: World) {
        super.setWorld(world);
        world.collisionSystem.addHitbox(this);
    }
}
