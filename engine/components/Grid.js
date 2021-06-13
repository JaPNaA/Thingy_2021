import { CanvasElm } from "../canvas/CanvasElm.js";

export class Grid extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;
    }

    draw() {
        const width = this.world.canvas.width;
        const height = this.world.canvas.height;
        this._drawGridCellSize(1000, width, height);
        this._drawGridCellSize(100, width, height);
    }

    _drawGridCellSize(scaleSize, gridWidth, gridHeight) {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const cellSize =
            scaleSize * this.world.camera.zoom * (
                Math.pow(
                    10,
                    Math.floor(
                        -Math.log10(this.world.camera.zoom)
                    )
                )
            );
        const offsetX = -this.world.camera.x % cellSize;
        const offsetY = -this.world.camera.y % cellSize;

        X.save();
        X.strokeStyle = "#ffffff";
        X.lineWidth = 0.5;
        X.globalAlpha = (cellSize / 100) * 0.25;
        X.beginPath();

        for (let x = offsetX; x < gridWidth; x += cellSize) {
            X.moveTo(x, 0);
            X.lineTo(x, gridHeight);
        }

        for (let y = offsetY; y < gridHeight; y += cellSize) {
            X.moveTo(0, y);
            X.lineTo(gridWidth, y);
        }

        X.stroke();
        X.restore();
    }
}