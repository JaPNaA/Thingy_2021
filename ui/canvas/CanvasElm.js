export class CanvasElm {
    constructor() {
        /** @type {import("./World.js").World} */
        this.world = null;
    }

    draw() {
        throw new Error("CanvasElm doesn't have draw implemented");
    }
}
