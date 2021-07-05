import { CanvasElm } from "../engine/CanvasElm";

export class NPCDialog extends CanvasElm {
    constructor(private dialog: string[]) {
        super();
    }

    public draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#4448";
        X.fillRect(8, 300, 500, 200);

        X.fillStyle = "#aaa";
        X.font = "24px Arial";
        X.textBaseline = "top";
        X.fillText(this.dialog[0], 16, 308);
    }
}
