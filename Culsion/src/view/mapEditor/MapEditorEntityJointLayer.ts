import { CanvasElmWithEventBus } from "../../engine/canvasElm/CanvasElmWithEventBus";
import { TileMap } from "../../entities/TileMap";

export class MapEditorEntityJointLayer extends CanvasElmWithEventBus {
    constructor(private tileMap: TileMap) {
        super();

        this.eventBus.subscribe("mousedown", () => this.mousedownHandler())
    }

    public mousedownHandler() {
        for (const joint of this.tileMap._getJoints()) {
            const cursorX = this.world.camera.clientXToWorld(this.world.mouse.x);
            const cursorY = this.world.camera.clientYToWorld(this.world.mouse.y);
            const jointX = (joint.x + 0.5) * this.tileMap.tileSize;
            const jointY = (joint.y + 0.5) * this.tileMap.tileSize;
            const r = this.tileMap.tileSize / 4;

            const dx = cursorX - jointX;
            const dy = cursorY - jointY;

            if (dx * dx + dy * dy < r * r) {
                this.eventBus.stopPropagation();
            }
        }
    }

    public draw() {
        const X = this.world.canvas.X;

        for (const joint of this.tileMap._getJoints()) {
            const jointX = (joint.x + 0.5) * this.tileMap.tileSize;
            const jointY = (joint.y + 0.5) * this.tileMap.tileSize;
            const r = this.tileMap.tileSize / 4;

            X.fillStyle = "#00ff0088";

            X.beginPath();
            X.arc(jointX, jointY, r, 0, Math.PI * 2);
            X.fill();
        }
    }
}