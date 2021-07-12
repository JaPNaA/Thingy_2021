import { isRectanglesColliding } from "../engine/collision/isRectanglesColliding";
import { ParentCanvasElm } from "../engine/ParentCanvasElm";
import { Rectangle } from "../engine/util/Rectangle";
import { removeElmFromArray } from "../engine/util/removeElmFromArray";
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

                    const record = this.addTileMap(tileMap, newJoint)!;
                    record.toMap = jointRecord.map;
                    jointRecord.toMap = record.map;
                });
        }

        for (const jointRecord of this.unjoinableJoints) {
            if (
                isRectanglesColliding(jointRecord.location, this.view) ||
                isRectanglesColliding(jointRecord.map.rect, this.view)
            ) { continue; }
            this.removeMap(jointRecord.map);
        }
    }

    private addTileMap(tileMap: TileMap, excludeJoint?: TileMapJoint): JointRecord | undefined {
        const joints = tileMap._getJoints();
        let excludedJointRecord;

        for (const joint of joints) {
            const record = {
                map: tileMap,
                joint: joint,
                location: new Rectangle(
                    joint.x * tileMap.tileSize + tileMap.rect.x,
                    joint.y * tileMap.tileSize + tileMap.rect.y,
                    tileMap.tileSize, tileMap.tileSize
                )
            };

            if (joint === excludeJoint) {
                this.unjoinableJoints.push(record);
                excludedJointRecord = record;
            } else {
                this.joinableJoints.push(record);
            }
        }

        this.activeMaps.push(tileMap);
        this.addChild(tileMap);

        return excludedJointRecord;
    }

    private setJointRecordUnjoinable(joint: JointRecord) {
        removeElmFromArray(joint, this.joinableJoints);
        this.unjoinableJoints.push(joint);
    }

    private setJointRecordJoinable(joint: JointRecord) {
        removeElmFromArray(joint, this.unjoinableJoints);
        this.joinableJoints.push(joint);
    }

    private removeMap(map: TileMap) {
        removeElmFromArray(map, this.activeMaps);

        for (let i = this.joinableJoints.length - 1; i >= 0; i--) {
            const joint = this.joinableJoints[i];
            if (joint.map === map) {
                this.joinableJoints.splice(i, 1);
            }
        }

        for (let j = this.unjoinableJoints.length - 1; j >= 0; j--) {
            const joint = this.unjoinableJoints[j];
            if (joint.map === map) {
                this.unjoinableJoints.splice(j, 1);
            } else if (joint.toMap === map) {
                this.setJointRecordJoinable(joint);
            }
        }

        this.removeChild(map);
    }
}

interface JointRecord {
    joint: TileMapJoint;
    map: TileMap;
    toMap?: TileMap;
    location: Rectangle;
}