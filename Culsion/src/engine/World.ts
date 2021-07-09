import { Camera } from "./Camera";
import { Canvas } from "./Canvas";
import { CanvasElm } from "./CanvasElm";
import { CollisionSystem } from "./collision/CollisionSystem";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";

export class World {
    public canvas = new Canvas();
    public camera = new Camera(this);
    public keyboard = new Keyboard();
    public mouse = new Mouse();
    public collisionSystem = new CollisionSystem();

    public timeElapsed = 0;

    private elms: CanvasElm[] = [];

    private lastTime = performance.now();

    constructor() {
        this.canvas.resizeToScreen();
    }

    public startListen() {
        this.keyboard._startListen();
        this.mouse._startListen();
    }

    public stopListen() {
        this.keyboard._stopListen();
        this.mouse._stopListen();
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
        const X = this.canvas.X;

        const now = performance.now();
        this.timeElapsed = (now - this.lastTime) / 1000;
        this.lastTime = now;

        for (const elm of this.elms) {
            elm.tick();
        }

        this.collisionSystem._checkCollisions();
        this.camera._update();

        X.fillStyle = "#000000";
        X.fillRect(0, 0, this.canvas.width, this.canvas.height);

        X.save();

        this.camera._applyTransform(X);

        for (const elm of this.elms) {
            elm.draw();
        }

        X.restore();
    }

    public appendTo(parent: HTMLElement) {
        this.canvas.appendTo(parent);
    }
}