import { World } from "./World";

export abstract class CanvasElm {
    protected world!: World;

    abstract draw(): void;

    public setWorld(world: World) {
        this.world = world;
    }
}
