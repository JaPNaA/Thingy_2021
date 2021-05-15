import { Vec2 } from "../../utils/vectors.js";

export class Camera extends Vec2 {
    /**
     * @param {import("../World.js").World} world
     */
    constructor(world) {
        super(0, 0);
        this.zoom = 1;

        this.panning = false;

        world.keyboard.addKeyDownListener("KeyW", () => this.y -= 5);
        world.keyboard.addKeyDownListener("KeyA", () => this.x -= 5);
        world.keyboard.addKeyDownListener("KeyS", () => this.y += 5);
        world.keyboard.addKeyDownListener("KeyD", () => this.x += 5);
        world.keyboard.addKeyDownListener("Equal", () => this.zoom *= 1.05);
        world.keyboard.addKeyDownListener("Minus", () => this.zoom /= 1.05);
        world.keyboard.addKeyDownListener("Digit0", () => this.zoom = 1);

        world.keyboard.addKeyDownListener("Space", () => this.panning = true);
        world.keyboard.addKeyUpListener("Space", () => this.panning = false);
        world.cursor.mouseMove.addHandler(e => {
            if (this.panning) {
                this.y -= e.movementY;
                this.x -= e.movementX;
            }
        });
    }
}
