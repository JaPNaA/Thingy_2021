import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { EntityData } from "../../resources/TileMapFile";
import { NPCWithDialog } from "../NPCWithDialog";


/**
 * A parent to store Entities inside of TileMaps.
 */
export class EntitiesInTileMap extends ParentCanvasElm {
    constructor(private entities: readonly EntityData[]) {
        super();

        for (const entity of entities) {
            this.addChild(new NPCWithDialog(entity.x, entity.y));
        }
    }
}
