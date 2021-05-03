class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /** @param {Vec2} other */
    add(other) {
        return new Vec2(
            this.x + other.x,
            this.y + other.y
        );
    }

    /** @param {Vec2} other */
    subtract(other) {
        return new Vec2(
            this.x - other.x,
            this.y - other.y
        );
    }

    /** @param {number} scalar */
    scale(scalar) {
        return new Vec2(
            this.x * scalar,
            this.y * scalar
        );
    }

    /** @param {Vec2} other */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get angle() {
        return Math.atan2(this.y, this.x);
    }
}

/**
 * Neat function to create vectors
 * @param {number} x
 * @param {number} y
 * @param {number} [z]
 * @returns {Vec2}
 */

function vec(x, y, z) {
    if (z === undefined) {
        return new Vec2(x, y);
    } else {
        throw new Error("3d vectors not implemented :/");
    }
}

export { vec, Vec2 };
