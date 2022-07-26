import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { NPCWithDialog } from "../NPCWithDialog";
import { TileMap } from "./TileMap";
import { TileMapEntity } from "./TileMapEntity";


/**
 * A parent to store Entities inside of TileMaps.
 */
export class EntitiesInTileMap extends ParentCanvasElm {
    constructor(private tileMap: TileMap) {
        super();

        const entities = tileMap.getEntityData();
        for (const entity of entities) {
            this.addChild(new NPCWithDialog(
                entity.x * TileMapEntity.tileSize,
                entity.y * TileMapEntity.tileSize
            ));
        }
    }
}
