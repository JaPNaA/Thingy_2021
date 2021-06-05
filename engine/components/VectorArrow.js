import { CanvasElm } from "../canvas/CanvasElm.js";

export class VectorArrow extends CanvasElm {
    constructor(tail, value) {
        super();

        this.staticPosition = true;

        this.tailPos = tail;
        this.value = value;
        this.tailHightlighted = false;
        this.arrowSize = 8;
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const absTailPos = this.world.camera.transformPoint(this.tailPos);
        const absHeadPos = this.world.camera.transformPoint(this.tailPos.add(this.value));
        const angle = this.value.angle + Math.PI / 4;

        X.strokeStyle = "#ffffff";
        X.lineWidth = 1;
        X.beginPath();
        X.moveTo(absTailPos.x, absTailPos.y);
        X.lineTo(absHeadPos.x, absHeadPos.y);
        X.stroke();

        X.fillStyle = this.tailHightlighted ? "#ff0000" : "#aaaaaa";
        X.beginPath();
        X.moveTo(absHeadPos.x, absHeadPos.y);
        X.lineTo(absHeadPos.x - this.arrowSize * Math.sin(angle), absHeadPos.y + this.arrowSize * Math.cos(angle));
        X.lineTo(absHeadPos.x - this.arrowSize * Math.cos(angle), absHeadPos.y - this.arrowSize * Math.sin(angle));
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
