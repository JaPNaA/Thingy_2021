import { Elm } from "../../utils/elements.js";
import { vec, Vec2 } from "../../utils/vectors.js";

export class HTMLCanvasElm extends Elm {
    constructor() {
        super("div");
        this.class("HTMLCanvasElm");

        this.displacement = vec(0, 0);
        this.pos = vec(0, 0);
        this.scale = 0;
        this.staticPosition = false;
        this.hidden = false;
    }

    /** @param {Vec2} displacement */
    setTransformation(displacement, scale) {
        this.displacement = displacement;
        this.scale = scale;
        this.updateInlineStyle();
    }

    /** @param {Vec2} pos */
    setPos(pos) {
        this.pos = pos;
        this.updateInlineStyle();
    }

    hide() {
        this.hidden = true;
        this.updateInlineStyle();
    }

    show() {
        this.hidden = false;
        this.updateInlineStyle();
    }

    updateInlineStyle() {
        if (this.hidden) { 
            this.attribute("style", "display: none");
            return;
        }

        if (this.staticPosition) {
            this.attribute("style", "position: static");
        } else {
            const pos = this.pos.scale(this.scale).add(this.displacement);
            this.attribute("style", `left: ${pos.x}px; top: ${pos.y}px`);
        }
    }
}
