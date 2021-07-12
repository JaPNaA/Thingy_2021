import { ParentCanvasElm } from "../engine/ParentCanvasElm";
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

        this.addChild(new NPCWithDialog(2500, 2500));

        resourceFetcher.fetchRaw("assets/mazeSolved.tmap")
            .then(file => {
                this.addChild(
                    new ParentTileMap(TileMapFile.fromBuffer(file), this.player.rect)
                );
                this.addChild(this.player);
            });
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.camera.follow(this.player.rect);
    }
}
