/**
 * @typedef {import("../../utils/vectors.js").Vec2} Vec2
 */

/**
 * Cursor HitBox for CanvasElms
 */
export class HitBox {
    /**
     * @param {Vec2} pos
     * @param {Vec2} dim
     */
    constructor(pos, dim) {
        this.pos = pos;
        this.dim = dim;

        /** @type {function} */
        this.mousemoveHandler = null;
        
        /** @type {function} */
        this.mousedownHandler = null;

        /** @type {function} */
        this.mouseoffHandler = null;

        this._hovering = false;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    tryMousemove(x, y) {
        if (!this.mousemoveHandler && !this.mouseoffHandler) { return; }
        if (this._checkHit(x, y)) {
            if (this.mousemoveHandler) {
                this.mousemoveHandler();
            }

            this._hovering = true;
        } else {
            this._hovering = false;
            if (this.mouseoffHandler) {
                this.mouseoffHandler();
            }
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    tryMousedown(x, y) {
        if (this.mousedownHandler && this._checkHit(x, y)) {
            this.mousedownHandler();
        }
    }

    /** @param {function} handler */
    setMousemoveHandler(handler) {
        this.mousemoveHandler = handler;
    }

    /** @param {function} handler */
    setMousedownHandler(handler) {
        this.mousedownHandler = handler;
    }

    /** @param {function} handler */
    setMouseoffHandler(handler) {
        this.mouseoffHandler = handler;
    }

    /** @param {Vec2} dim */
    setPos(pos) {
        this.pos = pos;
    }

    /** @param {Vec2} dim */
    setDim(dim) {
        this.dim = dim;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    _checkHit(x, y) {
        return x >= this.pos.x && x <= this.pos.x + this.dim.x &&
            y >= this.pos.y && y <= this.pos.y + this.dim.y;
    }
}
