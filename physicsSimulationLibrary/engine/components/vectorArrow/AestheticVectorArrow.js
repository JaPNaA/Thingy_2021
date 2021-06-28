import { VectorArrow } from "./VectorArrow.js";

/**
 * Like VectorArrow, but looks better with a tradeoff in accuracy
 */
export class AestheticVectorArrow extends VectorArrow {
    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const magnitude = Math.min(this.value.magnitude, 1e2);

        const sqrtMagnitude = Math.sqrt(magnitude);

        const absTailPos = this.world.camera.transformPoint(this.tailPos);
        const absHeadPos = this.world.camera.transformPoint(
            this.tailPos.add(
                this.value.withMagnitude(sqrtMagnitude)
            )
        );
        const angle = this.value.angle;
        const zoom = this.world.camera.zoom;

        const arrowSize = this.arrowSize * sqrtMagnitude / 16 * zoom;

        X.strokeStyle = "#ffffff";
        X.lineWidth = sqrtMagnitude / 4 * zoom;
        X.beginPath();
        X.moveTo(absTailPos.x, absTailPos.y);
        X.lineTo(absHeadPos.x, absHeadPos.y);
        X.stroke();

        X.fillStyle = this.tailHightlighted ? "#ff0000" : "#aaaaaa";
        X.save();

        X.beginPath();
        X.translate(absHeadPos.x, absHeadPos.y);
        X.rotate(angle);
        X.moveTo(arrowSize, 0);
        X.lineTo(0, arrowSize);
        X.lineTo(0, -arrowSize);
        X.closePath();
        X.fill();

        X.restore();
    }
}
