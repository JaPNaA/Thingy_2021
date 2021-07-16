import { ParentCanvasElm } from "../engine/canvasElm/ParentCanvasElm";
import { World } from "../engine/World";
import { NPCWithDialog } from "../entities/NPCWithDialog";
import { ParentTileMap } from "../entities/ParentTileMap";
import { Player } from "../entities/Player";
import { resourceFetcher } from "../resources/resourceFetcher";
import { TileMapFile } from "../resources/TileMapFile";

export class GameView extends ParentCanvasElm {
    private player = new Player();

    constructor() {
        super();

        resourceFetcher.fetchRaw("assets/mazeSolved.tmap")
            .then(file => {
                this.addChild(
                    new ParentTileMap(TileMapFile.fromBuffer(file), this.world.camera.rect)
                );
                this.addChild(this.player);
                this.addChild(new NPCWithDialog(3750, 3750));
                this.addChild(new NPCWithDialog(100, -200));
            });
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.camera.follow(this.player.rect);
    }
}
