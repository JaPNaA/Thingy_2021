import { CanvasElmWithEventBus } from "../../engine/canvasElm/CanvasElmWithEventBus";
import { TileMap } from "../../entities/TileMap";
import { TileMapJoint } from "../../resources/TileMapFile";

export class MapEditorEntityJointLayer extends CanvasElmWithEventBus {
    private joints: JointRecord[] = [];

    constructor(private tileMap: TileMap) {
        super();

        this.eventBus.subscribe("mousedown", () => this.mousedownHandler());

        for (const joint of this.tileMap._getJoints()) {
            this.joints.push({
                joint: joint,
                x: this.tileMap.tileSize * (joint.x + 0.5),
                y: this.tileMap.tileSize * (joint.y + 0.5)
            });
        }
    }

    public mousedownHandler() {
        const jointRadius = this.tileMap.tileSize / 4;

        for (const joint of this.joints) {
            const cursorX = this.world.camera.clientXToWorld(this.world.mouse.x);
            const cursorY = this.world.camera.clientYToWorld(this.world.mouse.y);

            const dx = cursorX - joint.x;
            const dy = cursorY - joint.y;

            if (dx * dx + dy * dy < jointRadius * jointRadius) {
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
}

interface JointRecord {
    x: number;
    y: number;
    joint: TileMapJoint;
}
