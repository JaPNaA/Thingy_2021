import { ParentCanvasElm } from "../../engine/ParentCanvasElm";
import { World } from "../../engine/World";
import { TileMap } from "../../entities/TileMap";

export class MapEditor extends ParentCanvasElm {
    private tileMap = new TileMap();
    private ghostPlayer = new GhostPlayer();

    constructor() {
        super();
        this.addChild(this.tileMap);
        this.addChild(this.ghostPlayer);
        console.log(this);
    }

    public setWorld(world: World) {
        super.setWorld(world);
        this.world.camera.follow(this.ghostPlayer.rect);
    }

    public tick() {
        super.tick();

        if (this.world.mouse.leftDown) {
            this.tileMap.setBlock(this.world.mouse.x, this.world.mouse.y, true);
        } else if (this.world.mouse.rightDown) {
            this.tileMap.setBlock(this.world.mouse.x, this.world.mouse.y, false);
        }
    }

    public exportMap() {
        // @ts-expect-error -- temporary
        const map = this.tileMap.map;
        if (!map) { return; }

        return map.map(row => row.map(block => block ? "x" : " ").join("")).join("\n");
    }
}
