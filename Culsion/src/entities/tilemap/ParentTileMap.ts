import { isRectanglesColliding } from "../../engine/collision/isRectanglesColliding";
import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { Rectangle } from "../../engine/util/Rectangle";
import { isTileMapJointExtention } from "../../resources/TileMapFile";
import { TileMapEntity } from "./TileMapEntity";
import { TileMap } from "./TileMap";
import { tileMapFetcher } from "../../resources/tileMapFetcher";

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
                const entity = new TileMapEntity(map.map);
                entity.rect.x = map.rect.x;
                entity.rect.y = map.rect.y;
                this.activeMapEntities.push(entity);
                this.addChild(entity);
                map.active = true;
            }
        }
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
            if (!isTileMapJointExtention(joint)) { continue; }

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