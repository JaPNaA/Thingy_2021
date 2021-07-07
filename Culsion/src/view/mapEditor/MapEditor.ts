import { ParentCanvasElm } from "../../engine/ParentCanvasElm";
import { TileMap } from "../../entities/TileMap";

export class MapEditor extends ParentCanvasElm {
    constructor() {
        super();
        this.addChild(new TileMap());
    }
}
