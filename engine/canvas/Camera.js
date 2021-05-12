import { Vec2 } from "../../utils/vectors.js";

export class Camera extends Vec2 {
    /**
     * @param {import("./Keyboard.js").Keyboard} keyboard
     */
    constructor(keyboard) {
        super(0, 0);
        this.zoom = 1;

        this.keyboard = keyboard;

        this.keyboard.addKeyDownListener("KeyW", () => this.y -= 5);
        this.keyboard.addKeyDownListener("KeyA", () => this.x -= 5);
        this.keyboard.addKeyDownListener("KeyS", () => this.y += 5);
        this.keyboard.addKeyDownListener("KeyD", () => this.x += 5);
    }
}
