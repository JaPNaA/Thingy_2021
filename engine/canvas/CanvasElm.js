/**
 * @typedef {import("./World.js").World} World
 */

export class CanvasElm {
    constructor() {
        /** @type {World} */
        this.world = null;
        this.staticPosition = false;
    }

    /** @param {World} world */
    setup(world) {
        this.world = world;
    }

    update() { }

    draw() {
        throw new Error("CanvasElm doesn't have draw implemented");
    }
}
