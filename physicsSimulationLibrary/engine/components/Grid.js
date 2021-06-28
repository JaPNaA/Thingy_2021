import { CanvasElm } from "../canvas/CanvasElm.js";
import { vec } from "../../utils/vectors.js";
import { colors } from "../../ui/colors.js";

export class Grid extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;

        this.drawScale = true;
    }

    draw() {
        const width = this.world.canvas.width;
        const height = this.world.canvas.height;
        this._drawGridCellSize(1000, width, height);
        this._drawGridCellSize(100, width, height);
        this._drawScale();
    }

    _drawGridCellSize(scaleSize, gridWidth, gridHeight) {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const cellSize = this._calculateCellSize(scaleSize);
            
        const offsetX = -this.world.camera.x % cellSize;
        const offsetY = -this.world.camera.y % cellSize;

        X.save();
        X.strokeStyle = "#ffffff";
        X.lineWidth = 0.5;
        X.globalAlpha = (cellSize / 100) * 0.25;
        X.globalCompositeOperation = "destination-over";
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

    _calculateCellSize(scaleSize) {
        return scaleSize * this.world.camera.zoom * (
            Math.pow(
                10,
                Math.floor(
                    -Math.log10(this.world.camera.zoom)
                )
            )
        );
    }

    _drawScale() {
        // const bottomLeft = vec(0, this.world.canvas.height);

        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const bottomLeft = vec(8, this.world.canvas.height - 8);

        let cellSize = this._calculateCellSize(100);
        if (cellSize < 32) {
            cellSize = this._calculateCellSize(1000);
        }

        X.lineWidth = 2;
        X.strokeStyle = colors.white;
        X.beginPath();
        X.moveTo(bottomLeft.x, bottomLeft.y);
        X.lineTo(bottomLeft.x + cellSize, bottomLeft.y);
        X.stroke();

        X.textAlign = "center";
        X.fillStyle = colors.white;
        X.fillText(Number((cellSize / this.world.camera.zoom).toPrecision(1)) + "m", bottomLeft.x + cellSize / 2, bottomLeft.y - 8);
    }
}