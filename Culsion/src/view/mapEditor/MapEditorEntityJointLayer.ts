import { CanvasElmWithEventBus } from "../../engine/canvasElm/CanvasElmWithEventBus";
import { TileMapEntity } from "../../entities/tilemap/TileMapEntity";
import { EntityData, TileMapJoint } from "../../resources/TileMapFile";
import { MapEditorOverlay } from "./MapEditorOverlay";

export class MapEditorEntityJointLayer extends CanvasElmWithEventBus {
    private joints: JointRecord[] = [];
    private entities: EntityRecord[] = [];

    constructor(private tileMap: TileMapEntity, private overlay: MapEditorOverlay) {
        super();

        this.eventBus.subscribe("mousedown", () => this.mousedownHandler());

        this.updateJointRecords();
        this.tileMap.data.onJointEdit.addHandler(() => this.updateJointRecords());
        this.updateEntityRecords();
        this.tileMap.data.onEntityEdit.addHandler(() => this.updateEntityRecords());
    }

    public mousedownHandler() {
        const quarterTile = this.tileMap.tileSize / 4;

        for (const joint of this.joints) {
            const cursorX = this.world.camera.clientXToWorld(this.world.mouse.x);
            const cursorY = this.world.camera.clientYToWorld(this.world.mouse.y);

            const dx = cursorX - joint.x;
            const dy = cursorY - joint.y;

            if (dx * dx + dy * dy < quarterTile * quarterTile) {
                if (this.world.mouse.rightDown) {
                    this.tileMap.data.removeJoint(joint.joint);
                } else {
                    this.overlay.editJoint(joint.joint);
                }
                this.eventBus.stopPropagation();
            }
        }

        for (const entity of this.entities) {
            const cursorX = this.world.camera.clientXToWorld(this.world.mouse.x);
            const cursorY = this.world.camera.clientYToWorld(this.world.mouse.y);

            const dx = Math.abs(cursorX - entity.x);
            const dy = Math.abs(cursorY - entity.y);

            if (dx < quarterTile && dy < quarterTile) {
                if (this.world.mouse.rightDown) {
                    this.tileMap.data.removeEntity(entity.entity);
                } else {
                    this.overlay.editEntity(entity.entity);
                }
                this.eventBus.stopPropagation();
            }
        }
    }

    public draw() {
        const X = this.world.canvas.X;

        const quarterTile = this.tileMap.tileSize / 4;

        X.fillStyle = "#00ff0088";
        for (const joint of this.joints) {
            X.beginPath();
            X.arc(joint.x, joint.y, quarterTile, 0, Math.PI * 2);
            X.fill();
        }

        X.fillStyle = "#0000ff88";
        for (const entity of this.entities) {
            X.beginPath();
            X.fillRect(
                entity.x - quarterTile, entity.y - quarterTile,
                quarterTile * 2, quarterTile * 2
            );
        }
    }

    private updateJointRecords() {
        this.joints.length = 0;

        for (const joint of this.tileMap.data.getJoints()) {
            this.joints.push({
                joint: joint,
                x: this.tileMap.tileSize * (joint.x + 0.5),
                y: this.tileMap.tileSize * (joint.y + 0.5)
            });
        }
    }

    private updateEntityRecords() {
        this.entities.length = 0;

        for (const entity of this.tileMap.data.getEntities()) {
            this.entities.push({
                entity: entity,
                x: this.tileMap.tileSize * (entity.x + 0.5),
                y: this.tileMap.tileSize * (entity.y + 0.5)
            });
        }
    }
}

interface JointRecord {
    x: number;
    y: number;
    joint: TileMapJoint;
}

interface EntityRecord {
    x: number;
    y: number;
    entity: EntityData;
}
