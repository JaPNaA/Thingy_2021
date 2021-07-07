import { Canvas } from "./Canvas";
import { CanvasElm } from "./CanvasElm";
import { CollisionSystem } from "./collision/CollisionSystem";
import { Keyboard } from "./Keyboard";

export class World {
    public canvas = new Canvas();
    public keyboard = new Keyboard();
    public collisionSystem = new CollisionSystem();

    private elms: CanvasElm[] = [];

    constructor() {
        this.canvas.resizeToScreen();
    }

    public addElm(elm: CanvasElm) {
        elm.setWorld(this);
        this.elms.push(elm);
    }

    public removeElm(elm: CanvasElm) {
        elm.dispose();

        const index = this.elms.indexOf(elm);
        if (index < 0) { throw new Error("Tried removing element that wasn't added"); }
        this.elms.splice(index, 1);
    }

    public draw() {
        this.canvas.X.fillStyle = "#000000";
        this.canvas.X.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const elm of this.elms) {
            elm.tick();
        }

        this.collisionSystem._checkCollisions();

        for (const elm of this.elms) {
            elm.draw();
        }
    }

    public appendTo(parent: HTMLElement) {
        this.canvas.appendTo(parent);
    }
}