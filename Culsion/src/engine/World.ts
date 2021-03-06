import { Camera } from "./Camera";
import { Canvas } from "./Canvas";
import { CanvasElm } from "./canvasElm/CanvasElm";
import { CanvasElmWithEventBus } from "./canvasElm/CanvasElmWithEventBus";
import { CollisionSystem } from "./collision/CollisionSystem";
import { EventBus } from "./EventBus";
import { HTMLOverlay } from "./HTMLOverlay";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";

export class World {
    public canvas = new Canvas();
    public htmlOverlay = new HTMLOverlay();
    public camera = new Camera(this);

    public eventBus = new EventBus();
    public keyboard = new Keyboard();
    public mouse = new Mouse(this.eventBus);

    public collisionSystem = new CollisionSystem();

    public timeElapsed = 0;

    private elms: CanvasElm[] = [];

    private lastTime = performance.now();
    private maxTickTimeElapse = 0.020;

    constructor() {
        this.canvas.resizeToScreen();
    }

    public startListen() {
        this.keyboard._startListen();
        this.mouse._startListen();
        this.canvas._startAutoResize();
    }

    public stopListen() {
        this.keyboard._stopListen();
        this.mouse._stopListen();
        this.canvas._stopAutoResize();
    }

    public addElm(elm: CanvasElm, index?: number) {
        elm.setWorld(this);
        if (elm instanceof CanvasElmWithEventBus) {
            elm.eventBus._attach(this.eventBus);
        }

        //* temporary -- introduce zIndex
        if (index !== undefined) {
            this.elms.splice(index, 0, elm);
        } else {
            this.elms.push(elm);
        }
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
        let timeElapsed = (now - this.lastTime) / 1000;
        this.lastTime = now;

        for (; timeElapsed > this.maxTickTimeElapse; timeElapsed -= this.maxTickTimeElapse) {
            this.timeElapsed = this.maxTickTimeElapse;
            this.tick();
        }

        this.timeElapsed = timeElapsed;
        this.tick();

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

    private tick() {
        for (const elm of this.elms) {
            elm.tick();
        }

        this.collisionSystem._checkCollisions();
    }

    public appendTo(parent: HTMLElement) {
        this.canvas.appendTo(parent);
        this.htmlOverlay.appendTo(parent);
    }
}
