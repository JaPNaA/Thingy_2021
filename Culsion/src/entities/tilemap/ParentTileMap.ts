import { isRectanglesColliding } from "../../engine/collision/isRectanglesColliding";
import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { Rectangle } from "../../engine/util/Rectangle";
import { isTileMapJointExtension } from "../../resources/TileMapFile";
import { TileMapEntity } from "./TileMapEntity";
import { TileMap } from "./TileMap";
import { tileMapFetcher } from "../../resources/tileMapFetcher";
import { EntitiesInTileMap } from "./EntitiesInTileMap";

/**
 * A parent for TileMaps. Manages TileMap loading and unloading.
 * 
 * Children include TileMapEntity and EntitiesInTileMap.
 */
export class ParentTileMap extends ParentCanvasElm {
    private activeMapEntities: TileMapEntity[] = [];
    private maps: MapRecord[] = [];

    constructor(mapFile: TileMap, private view: Rectangle) {
        super();
        this.addTileMap(mapFile, 0, 0);
        console.log(this);
    }

    public tick() {
        super.tick();

        for (const map of this.maps) {
            if (map.active) { continue; }

            if (isRectanglesColliding(this.view, map.rect)) {
                this.activateMap(map);
            }
        }
    }

    private activateMap(map: MapRecord) {
        const tileMapEntity = new TileMapEntity(map.map);
        const entitiesInTileMap = new EntitiesInTileMap(map.map.getEntityData());
        tileMapEntity.rect.x = map.rect.x;
        tileMapEntity.rect.y = map.rect.y;
        this.activeMapEntities.push(tileMapEntity);
        this.addChild(tileMapEntity);
        this.addChild(entitiesInTileMap);
        map.active = true;
    }

    private addTileMap(tileMap: TileMap, offsetX: number, offsetY: number) {
        const joints = tileMap.getJoints();

        this.maps.push({
            map: tileMap,
            rect: new Rectangle(offsetX, offsetY,
                tileMap.width * TileMapEntity.tileSize,
                tileMap.height * TileMapEntity.tileSize
            ),
            active: false
        });

        for (const joint of joints) {
            if (!isTileMapJointExtension(joint)) { continue; }

            tileMapFetcher.fetch(joint.toMap)
                .then(tileMap => {
                    const newJoint = tileMap.getJointById(joint.toId);
                    if (!newJoint) { throw new Error("Failed to join joints -- could not find target joint."); }

                    this.addTileMap(
                        tileMap,
                        (joint.x - newJoint.x) * TileMapEntity.tileSize + offsetX,
                        (joint.y - newJoint.y) * TileMapEntity.tileSize + offsetY,
                    );
                });
        }
    }
}

interface MapRecord {
    map: TileMap;
    rect: Rectangle;
    active: boolean;
}