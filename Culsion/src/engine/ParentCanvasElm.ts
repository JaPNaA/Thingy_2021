import { CanvasElm } from "./CanvasElm";
import { World } from "./World";

export class ParentCanvasElm extends CanvasElm {
    private children: CanvasElm[] = [];

    public draw() {
        for (const child of this.children) {
            child.draw();
        }
    }

    public tick() {
        for (const child of this.children) {
            child.tick();
        }
    }

    public setWorld(world: World) {
        super.setWorld(world);
        for (const child of this.children) {
            child.setWorld(world);
        }
    }

    public dispose() {
        for (const child of this.children) {
            child.dispose();
        }
    }

    protected addChild(child: CanvasElm) {
        this.children.push(child);
        if (this.world) {
            child.setWorld(this.world);
        }
    }
}
