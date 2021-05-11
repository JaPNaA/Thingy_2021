import { Elm } from "../../utils/elements.js";

export class HTMLCanvasElm extends Elm {
    constructor() {
        super("div");
        this.class("HTMLCanvasElm");
    }
}
