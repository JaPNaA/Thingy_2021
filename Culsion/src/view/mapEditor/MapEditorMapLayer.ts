import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { TileMapEntity } from "../../entities/TileMapEntity";
import { MapEditorOverlay } from "./MapEditorOverlay";

export class MapEditorMapLayer extends ParentCanvasElm {
    private leftDown = false;
    private rightDown = false;

    private fillMode = false;
    private fillModeCornerX = 0;
    private fillModeCornerY = 0;

    constructor(private tileMap: TileMapEntity, private overlay: MapEditorOverlay) {
        super();
        this.addChild(tileMap);

        this.eventBus.subscribe("mousedown", () => this.updateMouse());
        this.eventBus.subscribe("mouseup", () => this.updateMouse());
    }

    public updateMouse() {
        this.leftDown = this.world.mouse.leftDown;
        this.rightDown = this.world.mouse.rightDown;
        this.fillMode = this.overlay.fillMode;

        if (this.fillMode) {
            this.fillModeCornerX = this.getRelMouseX();
            this.fillModeCornerY = this.getRelMouseY();
        }
    }

    public tick() {
        super.tick();

        const xIndex = this.getRelMouseX();
        const yIndex = this.getRelMouseY();

        let selectedBlock: number;

        if (this.leftDown) {
            selectedBlock = this.overlay.selectedBlock;
        } else if (this.rightDown) {
            selectedBlock = 0;
        } else {
            return;
        }

        if (this.fillMode) {
            const left = Math.min(xIndex, this.fillModeCornerX);
            const right = Math.max(xIndex, this.fillModeCornerX);
            const top = Math.min(yIndex, this.fillModeCornerY);
            const bottom = Math.max(yIndex, this.fillModeCornerY);

            for (let y = top; y <= bottom; y++) {
                for (let x = left; x <= right; x++) {
                    this.tileMap.data.setBlockByIndex(x, y, selectedBlock);
                }
            }
        } else {
            this.tileMap.data.setBlockByIndex(xIndex, yIndex, selectedBlock);
        }
    }

    public draw() {
        super.draw();

        const xIndex = this.getRelMouseX();
        const yIndex = this.getRelMouseY();

        const X = this.world.canvas.X;

        X.fillStyle = "#ff0000";
        X.font = "12px Arial";
        X.textBaseline = "top";
        X.fillText(
            "(" + xIndex + ", " + yIndex + ")",
            xIndex * this.tileMap.tileSize, yIndex * this.tileMap.tileSize
        );
    }

    private getRelMouseX() {
        return Math.floor(this.world.camera.clientXToWorld(this.world.mouse.x) / this.tileMap.tileSize);
    }

    private getRelMouseY() {
        return Math.floor(this.world.camera.clientYToWorld(this.world.mouse.y) / this.tileMap.tileSize);
    }
}