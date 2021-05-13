import { Elm } from "../../utils/elements.js";
import { vec, Vec2 } from "../../utils/vectors.js";

export class HTMLCanvasElm extends Elm {
    constructor() {
        super("div");
        this.class("HTMLCanvasElm");

        this.displacement = vec(0, 0);
        this.pos = vec(0, 0);
    }

    /** @param {Vec2} displacement */
    setTranslation(displacement) {
        this.displacement = displacement;
        this.updateInlineStyle();
    }

    /** @param {Vec2} pos */
    setPos(pos) {
        this.pos = pos;
        this.updateInlineStyle();
    }

    updateInlineStyle() {
        this.attribute("style",
            `left: ${this.pos.x + this.displacement.x}px; top: ${this.pos.y + this.displacement.y}px`
        );
    }
}
