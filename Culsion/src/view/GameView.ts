import { ParentCanvasElm } from "../engine/ParentCanvasElm";
import { World } from "../engine/World";
import { NPCWithDialog } from "../entities/NPCWithDialog";
import { Player } from "../entities/Player";
import { TileMap } from "../entities/TileMap";

export class GameView extends ParentCanvasElm {
    private player = new Player();

    constructor() {
        super();

        this.addChild(this.player);
        this.addChild(new NPCWithDialog(2500, 2500));
        this.addChild(new TileMap());
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.camera.follow(this.player.rect);
    }
}
