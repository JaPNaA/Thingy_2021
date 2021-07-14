import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { TileMapEntity } from "../../entities/TileMapEntity";
import { MapEditorOverlay } from "./MapEditorOverlay";

export class MapEditorMapLayer extends ParentCanvasElm {
    private leftDown = false;
    private rightDown = false;

    constructor(private tileMap: TileMapEntity, private overlay: MapEditorOverlay) {
        super();
        this.addChild(tileMap);

        this.eventBus.subscribe("mousedown", () => this.updateMouse());
        this.eventBus.subscribe("mouseup", () => this.updateMouse());
    }

    public updateMouse() {
        this.leftDown = this.world.mouse.leftDown;
        this.rightDown = this.world.mouse.rightDown;
    }

    public tick() {
        super.tick();

        const x = this.world.camera.clientXToWorld(this.world.mouse.x);
        const y = this.world.camera.clientYToWorld(this.world.mouse.y);

        if (this.leftDown) {
            this.tileMap.setBlock(x, y, this.overlay.selectedBlock);
        } else if (this.rightDown) {
            this.tileMap.setBlock(x, y, 0);
        }
    }

    public draw() {
        super.draw();

        const x = this.world.camera.clientXToWorld(this.world.mouse.x);
        const y = this.world.camera.clientYToWorld(this.world.mouse.y);
        const xIndex = Math.floor(x / this.tileMap.tileSize);
        const yIndex = Math.floor(y / this.tileMap.tileSize);

        const X = this.world.canvas.X;

        X.fillStyle = "#ff0000";
        X.font = "12px Arial";
        X.textBaseline = "top";
        X.fillText(
            "(" + xIndex + ", " + yIndex + ")",
            xIndex * this.tileMap.tileSize, yIndex * this.tileMap.tileSize
        );
    }
}