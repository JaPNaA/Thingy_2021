import { CanvasElm } from "../canvas/CanvasElm.js";

export class VectorArrow extends CanvasElm {
    constructor(tail, value) {
        super();

        this.tailPos = tail;
        this.value = value;
        this.tailHightlighted = false;
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const relTailPos = this.world.camera.transformPoint(this.tailPos);
        const relHeadPos = this.world.camera.transformPoint(this.tailPos.add(this.value));

        X.strokeStyle = "#ffffff";
        X.lineWidth = 1;
        X.fillStyle = this.tailHightlighted ? "#ff0000" : "#aaaaaa";
        X.beginPath();
        X.moveTo(relTailPos.x, relTailPos.y);
        X.lineTo(relHeadPos.x, relHeadPos.y);
        X.stroke();
        X.fillRect(relHeadPos.x - 2, relHeadPos.y - 2, 4, 4);
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
