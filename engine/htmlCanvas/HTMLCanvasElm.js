import { Elm } from "../../utils/elements.js";

export class HTMLCanvasElm extends Elm {
    constructor() {
        super("div");
        this.class("HTMLCanvasElm");
    }

    /** @param {import("../../utils/vectors.js").Vec2} */
    setPos(pos) {
        this.attribute("style", `left: ${pos.x}px; top: ${pos.y}px`);
    }
}
