import { CanvasElmWithEventBus } from "../../engine/canvasElm/CanvasElmWithEventBus";
import { TileMapEntity } from "../../entities/tilemap/TileMapEntity";
import { TileMapJoint } from "../../resources/TileMapFile";
import { MapEditorOverlay } from "./MapEditorOverlay";

export class MapEditorEntityJointLayer extends CanvasElmWithEventBus {
    private joints: JointRecord[] = [];

    constructor(private tileMap: TileMapEntity, private overlay: MapEditorOverlay) {
        super();

        this.eventBus.subscribe("mousedown", () => this.mousedownHandler());

        this.updateJointRecords();
        this.tileMap.data.onJointEdit.addHandler(() => this.updateJointRecords());
    }

    public mousedownHandler() {
        const jointRadius = this.tileMap.tileSize / 4;

        for (const joint of this.joints) {
            const cursorX = this.world.camera.clientXToWorld(this.world.mouse.x);
            const cursorY = this.world.camera.clientYToWorld(this.world.mouse.y);

            const dx = cursorX - joint.x;
            const dy = cursorY - joint.y;

            if (dx * dx + dy * dy < jointRadius * jointRadius) {
                if (this.world.mouse.rightDown) {
                    this.tileMap.data.removeJoint(joint.joint);
                } else {
                    this.overlay.editJoint(joint.joint);
                }
                this.eventBus.stopPropagation();
            }
        }
    }

    public draw() {
        const X = this.world.canvas.X;

        const jointRadius = this.tileMap.tileSize / 4;

        for (const joint of this.joints) {
            X.fillStyle = "#00ff0088";

            X.beginPath();
            X.arc(joint.x, joint.y, jointRadius, 0, Math.PI * 2);
            X.fill();
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
}

interface JointRecord {
    x: number;
    y: number;
    joint: TileMapJoint;
}
