import { CanvasElm } from "../canvas/CanvasElm.js";

export class VectorArrow extends CanvasElm {
    constructor(tail, value) {
        super();

        this.tailPos = tail;
        this.value = value;
        this.tailHightlighted = false;
        this.arrowSize = 8;
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const relTailPos = this.world.camera.transformPoint(this.tailPos);
        const relHeadPos = this.world.camera.transformPoint(this.tailPos.add(this.value));
        const angle = this.value.angle + Math.PI / 4;

        X.strokeStyle = "#ffffff";
        X.lineWidth = 1;
        X.beginPath();
        X.moveTo(relTailPos.x, relTailPos.y);
        X.lineTo(relHeadPos.x, relHeadPos.y);
        X.stroke();

        X.fillStyle = this.tailHightlighted ? "#ff0000" : "#aaaaaa";
        X.beginPath();
        X.moveTo(relHeadPos.x, relHeadPos.y);
        X.lineTo(relHeadPos.x - this.arrowSize * Math.sin(angle), relHeadPos.y + this.arrowSize * Math.cos(angle));
        X.lineTo(relHeadPos.x - this.arrowSize * Math.cos(angle), relHeadPos.y - this.arrowSize * Math.sin(angle));
        X.closePath();
        X.fill();
    }

    setTail(tail) {
        this.tailPos = tail;
    }

    setValue(value) {
        this.value = value;
    }

    setTailHighlighted(tailHightlighted) {
        this.tailHightlighted = tailHightlighted;
    }
}
