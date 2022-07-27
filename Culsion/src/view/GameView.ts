import { ParentCanvasElm } from "../engine/canvasElm/ParentCanvasElm";
import { World } from "../engine/World";
import { ParentTileMap } from "../entities/tilemap/ParentTileMap";
import { Player } from "../entities/Player";
import { tileMapFetcher } from "../resources/tileMapFetcher";

export class GameView extends ParentCanvasElm {
    private player = new Player();

    constructor() {
        super();

        tileMapFetcher.fetch("cave")
            .then(tileMap => {
                this.addChild(
                    new ParentTileMap(tileMap, this.world.camera.rect)
                );
                this.addChild(this.player);
            });
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.camera.follow(this.player.rect);
    }
}
