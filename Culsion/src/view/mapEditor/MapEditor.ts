import { ParentCanvasElm } from "../../engine/ParentCanvasElm";
import { World } from "../../engine/World";
import { TileMap } from "../../entities/TileMap";

export class MapEditor extends ParentCanvasElm {
    private tileMap = new TileMap();

    constructor() {
        super();
        this.addChild(this.tileMap);
    }

    public setWorld(world: World) {
        super.setWorld(world);
    }

    public tick() {
        super.tick();

        if (this.world.mouse.leftDown) {
            this.tileMap.setBlock(this.world.mouse.x, this.world.mouse.y, true);
        } else if (this.world.mouse.rightDown) {
            this.tileMap.setBlock(this.world.mouse.x, this.world.mouse.y, false);
        }
    }
}
