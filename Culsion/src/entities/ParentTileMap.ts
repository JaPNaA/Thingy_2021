import { isRectanglesColliding } from "../engine/collision/isRectanglesColliding";
import { ParentCanvasElm } from "../engine/ParentCanvasElm";
import { Rectangle } from "../engine/util/Rectangle";
import { resourceFetcher } from "../resources/resourceFetcher";
import { TileMapFile, TileMapJoint } from "../resources/TileMapFile";
import { TileMap } from "./TileMap";

export class ParentTileMap extends ParentCanvasElm {
    private joinableJoints: [TileMap, TileMapJoint, Rectangle][] = [];
    private activeMaps: TileMap[] = [];
    private joint = false;

    constructor(mapFile: TileMapFile, private view: Rectangle) {
        super();
        this.addTileMap(new TileMap(mapFile));
        console.log(this);
    }

    public tick() {
        super.tick();

        for (const joint of this.joinableJoints) {
            const joint1 = joint[1];

            if (isRectanglesColliding(joint[2], this.view)) {
                if (!this.joint) {
                    this.joint = true;
                    resourceFetcher.fetchRaw("assets/" + joint[1].toMap + ".tmap")
                        .then(buffer => {
                            const tileMap = new TileMap(TileMapFile.fromBuffer(buffer));
                            const joint2 = tileMap._getJointById(joint1.toId);
                            if (!joint2) { throw new Error("Failed to join joints -- could not find target joint."); }

                            const dx = (joint1.x - joint2.x) * joint[0].tileSize;
                            const dy = (joint1.y - joint2.y) * joint[0].tileSize;

                            tileMap.rect.x += dx;
                            tileMap.rect.y += dy;

                            this.world.addElm(tileMap, 0);
                            this.addTileMap(tileMap)
                        });
                }
            }
        }
    }

    private addTileMap(tileMap: TileMap) {
        const joints = tileMap._getJoints();

        for (const joint of joints) {
            this.joinableJoints.push([
                tileMap, joint,
                new Rectangle(
                    joint.x * tileMap.tileSize, joint.y * tileMap.tileSize,
                    tileMap.tileSize, tileMap.tileSize
                )
            ]);
        }

        this.activeMaps.push(tileMap);
        this.addChild(tileMap);
    }
}