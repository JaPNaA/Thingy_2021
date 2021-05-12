import { CanvasElm } from "../CanvasElm.js";
import { TimeNode } from "./TimeNode.js"

export class TimePath extends CanvasElm {
    constructor() {
        super();
        
        /** @param {TimeNode[]} */
        this.nodes = [];
    }

    addNode(x, y, time) {
        this.nodes.push(new TimeNode(x, y, time));
    }

    clearNodes() {
        this.nodes.length = 0;
    }

    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#ffffff";

        for (const node of this.nodes) {
            X.fillRect(node.x, node.y, 1, 1);
        }
    }
}
