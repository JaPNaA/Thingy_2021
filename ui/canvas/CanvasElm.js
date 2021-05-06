/**
 * @typedef {import("./World.js").World} World
 */

export class CanvasElm {
    constructor() {
        /** @type {World} */
        this.world = null;
    }

    /** @param {World} world */
    setup(world) {
        this.world = world;
    }

    draw() {
        throw new Error("CanvasElm doesn't have draw implemented");
    }
}
