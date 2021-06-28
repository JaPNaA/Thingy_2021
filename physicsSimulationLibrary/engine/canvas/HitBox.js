import { vec } from "../../utils/vectors.js";

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
     * @param {number} [padding]
     */
    constructor(pos, dim, padding) {
        this.actualPos = pos;
        this.actualDim = dim;
        this.padding = padding || 0;
        this._updatePos();
        this._updateDim();

        /** @type {function} */
        this.mousemoveHandler = null;
        
        /** @type {function} */
        this.mousedownHandler = null;

        /** @type {function} */
        this.mouseoffHandler = null;

        this._hovering = false;

        this.disabled = false;
    }

    _updatePos() {
        this.pos = vec(
            (this.actualDim.x < 0 ? this.actualPos.x + this.actualDim.x : this.actualPos.x) - this.padding,
            (this.actualDim.y < 0 ? this.actualPos.y + this.actualDim.y : this.actualPos.y) - this.padding
        );
    }

    _updateDim() {
        this.dim = vec(Math.abs(this.actualDim.x) + this.padding * 2, Math.abs(this.actualDim.y) + this.padding * 2);
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    tryMousemove(x, y) {
        if (!this.mousemoveHandler && !this.mouseoffHandler || this.disabled) { return; }
        if (this._checkHit(x, y)) {
            if (this.mousemoveHandler) {
                this.mousemoveHandler();
            }

            this._hovering = true;
        } else {
            if (this.mouseoffHandler && this._hovering) {
                this.mouseoffHandler();
            }
            this._hovering = false;
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    tryMousedown(x, y) {
        if (this.mousedownHandler && !this.disabled && this._checkHit(x, y)) {
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

    setPosAndDim(pos, dim) {
        this.actualPos = pos;
        this.actualDim = dim;
        this._updateDim();
        this._updatePos();
    }

    /** @param {Vec2} dim */
    setPos(pos) {
        this.actualPos = pos;
        this._updatePos();
    }

    /** @param {Vec2} dim */
    setDim(dim) {
        this.actualDim = dim;
        this._updateDim();
        this._updatePos();
    }

    disable() {
        this.disabled = true;
    }

    enable() {
        this.disabled = false;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    _checkHit(x, y) {
        return ((x >= this.pos.x) ^ (x >= this.pos.x + this.dim.x)) &&
            ((y >= this.pos.y) ^ (y >= this.pos.y + this.dim.y));
    }
}
