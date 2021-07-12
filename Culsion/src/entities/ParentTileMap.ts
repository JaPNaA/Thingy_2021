import { isRectanglesColliding } from "../engine/collision/isRectanglesColliding";
import { ParentCanvasElm } from "../engine/ParentCanvasElm";
import { Rectangle } from "../engine/util/Rectangle";
import { resourceFetcher } from "../resources/resourceFetcher";
import { TileMapFile, TileMapJoint } from "../resources/TileMapFile";
import { TileMap } from "./TileMap";

export class ParentTileMap extends ParentCanvasElm {
    private joinableJoints: JointRecord[] = [];
    private unjoinableJoints: JointRecord[] = [];
    private activeMaps: TileMap[] = [];

    constructor(mapFile: TileMapFile, private view: Rectangle) {
        super();
        this.addTileMap(new TileMap(mapFile));
        console.log(this);
    }

    public tick() {
        super.tick();

        for (const jointRecord of this.joinableJoints) {
            if (!isRectanglesColliding(jointRecord.location, this.view)) { continue; }

            this.setJointRecordUnjoinable(jointRecord);

            resourceFetcher.fetchRaw("assets/" + jointRecord.joint.toMap + ".tmap")
                .then(buffer => {
                    const tileMap = new TileMap(TileMapFile.fromBuffer(buffer));
                    const newJoint = tileMap._getJointById(jointRecord.joint.toId);
                    if (!newJoint) { throw new Error("Failed to join joints -- could not find target joint."); }

                    const dx = (jointRecord.joint.x - newJoint.x) * jointRecord.map.tileSize + jointRecord.map.rect.x;
                    const dy = (jointRecord.joint.y - newJoint.y) * jointRecord.map.tileSize + jointRecord.map.rect.y;

                    tileMap.rect.x += dx;
                    tileMap.rect.y += dy;

                    this.addTileMap(tileMap, newJoint);
                });
        }
    }

    private addTileMap(tileMap: TileMap, excludeJoint?: TileMapJoint) {
        const joints = tileMap._getJoints();

        for (const joint of joints) {
            (joint === excludeJoint ? this.unjoinableJoints : this.joinableJoints)
                .push({
                    map: tileMap,
                    joint: joint,
                    location: new Rectangle(
                        joint.x * tileMap.tileSize + tileMap.rect.x,
                        joint.y * tileMap.tileSize + tileMap.rect.y,
                        tileMap.tileSize, tileMap.tileSize
                    )
                });
        }

        this.activeMaps.push(tileMap);
        this.addChild(tileMap);
    }

    private setJointRecordUnjoinable(joint: JointRecord) {
        const index = this.joinableJoints.indexOf(joint);
        if (index < 0) { throw new Error("Tried to mark joint as unjoinable, but was never joinable"); }
        this.joinableJoints.splice(index, 1);
        this.unjoinableJoints.push(joint);
    }
}

interface JointRecord {
    joint: TileMapJoint;
    map: TileMap;
    location: Rectangle;
}