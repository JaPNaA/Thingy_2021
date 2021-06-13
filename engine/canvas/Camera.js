import { vec, Vec2 } from "../../utils/vectors.js";

export class Camera extends Vec2 {
    /**
     * @param {import("../World.js").World} world
     */
    constructor(world) {
        super(0, 0);
        this.zoom = 1;
        this.zoomSpeed = 1.2;
        this.world = world;

        this.panning = false;

        world.keyboard.addKeyDownListener("KeyW", () => this.y -= 5);
        world.keyboard.addKeyDownListener("KeyA", () => this.x -= 5);
        world.keyboard.addKeyDownListener("KeyS", () => this.y += 5);
        world.keyboard.addKeyDownListener("KeyD", () => this.x += 5);

        world.keyboard.addKeyDownListener("Space", () => this.panning = true);
        world.keyboard.addKeyUpListener("Space", () => this.panning = false);
        world.cursor.mouseMove.addHandler(e => {
            if (this.panning) {
                this.y -= e.movementY;
                this.x -= e.movementX;
            }
        });

        world.keyboard.addKeyDownListener("Digit0", () => this._zoomIn(1 / this.zoom));
        world.keyboard.addKeyDownListener("Equal", () => this._zoomIn(this.zoomSpeed));
        world.keyboard.addKeyDownListener("Minus", () => this._zoomIn(1 / this.zoomSpeed));
        world.cursor.wheel.addHandler(e => {
            if (e.deltaY > 0) {
                this._zoomIn(1 / this.zoomSpeed ** (e.deltaY / 100));
            } else {
                this._zoomIn(this.zoomSpeed ** (-e.deltaY / 100));
            }
        });
    }

    transformPoint(vec2) {
        return vec2.scale(this.zoom).subtract(this);
    }

    centerOn(vec2) {
        this.x = vec2.x - innerWidth / 2;
        this.y = vec2.y - innerHeight / 2;
    }

    _zoomIn(scale) {
        const originalZoom = this.zoom;
        this.zoom *= scale;

        const dZoom = this.zoom - originalZoom;
        
        this.x += this.world.cursor.x * dZoom;
        this.y += this.world.cursor.y * dZoom;
    }
}
