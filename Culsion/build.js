System.register("engine/Canvas", [], function (exports_1, context_1) {
    "use strict";
    var Canvas;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Canvas = class Canvas {
                constructor() {
                    this.canvas = document.createElement("canvas");
                    this.X = this.canvas.getContext("2d", { alpha: false });
                    this.width = 0;
                    this.height = 0;
                    if (!this.X) {
                        alert("Browser not supported");
                        throw new Error("Browser not supported: cannot get canvas context");
                    }
                    this.resizeHandler = this.resizeHandler.bind(this);
                }
                resizeToScreen() {
                    const dpr = window.devicePixelRatio || 1;
                    this.width = innerWidth;
                    this.height = innerHeight;
                    this.canvas.width = dpr * this.width;
                    this.canvas.height = dpr * this.height;
                    this.X.scale(dpr, dpr);
                }
                _startAutoResize() {
                    addEventListener("resize", this.resizeHandler);
                }
                _stopAutoResize() {
                    removeEventListener("resize", this.resizeHandler);
                }
                appendTo(parent) {
                    parent.appendChild(this.canvas);
                }
                resizeHandler() {
                    this.resizeToScreen();
                }
            };
            exports_1("Canvas", Canvas);
        }
    };
});
System.register("engine/util/Rectangle", [], function (exports_2, context_2) {
    "use strict";
    var Rectangle;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Rectangle = class Rectangle {
                constructor(x, y, width, height) {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                }
            };
            exports_2("Rectangle", Rectangle);
        }
    };
});
System.register("engine/Camera", [], function (exports_3, context_3) {
    "use strict";
    var Camera;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            Camera = class Camera {
                constructor(world) {
                    this.x = 0;
                    this.y = 0;
                    this.scale = 1;
                    this.canvas = world.canvas;
                }
                follow(rect) {
                    this.following = rect;
                }
                clientXToWorld(x) {
                    return this.x + x / this.scale;
                }
                clientYToWorld(y) {
                    return this.y + y / this.scale;
                }
                _applyTransform(context) {
                    context.scale(this.scale, this.scale);
                    context.translate(-this.x, -this.y);
                }
                _update() {
                    if (!this.following) {
                        return;
                    }
                    this.x = this.following.x + this.following.width / 2 - this.canvas.width / 2 / this.scale;
                    this.y = this.following.y + this.following.height / 2 - this.canvas.height / 2 / this.scale;
                }
            };
            exports_3("Camera", Camera);
        }
    };
});
System.register("engine/CanvasElm", [], function (exports_4, context_4) {
    "use strict";
    var CanvasElm;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            CanvasElm = class CanvasElm {
                tick() { }
                setWorld(world) {
                    this.world = world;
                }
                dispose() {
                    // @ts-expect-error
                    this.world = undefined;
                }
            };
            exports_4("CanvasElm", CanvasElm);
        }
    };
});
System.register("engine/collision/Hitbox", [], function (exports_5, context_5) {
    "use strict";
    var Hitbox;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            Hitbox = class Hitbox {
                constructor(rectangle, elm) {
                    this.rectangle = rectangle;
                    this.elm = elm;
                }
            };
            exports_5("Hitbox", Hitbox);
        }
    };
});
System.register("engine/collision/CollisionReactionMap", [], function (exports_6, context_6) {
    "use strict";
    var CollisionReactionMap;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            CollisionReactionMap = class CollisionReactionMap {
                constructor() {
                    this.map = new Map();
                }
                setCollisionReaction(a, b, reaction) {
                    this.setEntry(a, b, reaction);
                    this.setEntry(b, a, (a, b) => reaction(b, a));
                }
                triggerReaction(a, b) {
                    if (a.elm.onCollision) {
                        a.elm.onCollision(b.elm);
                    }
                    if (b.elm.onCollision) {
                        b.elm.onCollision(a.elm);
                    }
                    const entry = this.map.get(a.elm.collisionType);
                    if (!entry) {
                        return;
                    }
                    const reactionFunc = entry.get(b.elm.collisionType);
                    if (!reactionFunc) {
                        return;
                    }
                    reactionFunc(a, b);
                }
                setEntry(a, b, reaction) {
                    const existingEntry = this.map.get(a);
                    if (existingEntry) {
                        existingEntry.set(b, reaction);
                    }
                    else {
                        const newEntry = new Map();
                        newEntry.set(b, reaction);
                        this.map.set(a, newEntry);
                    }
                }
            };
            exports_6("CollisionReactionMap", CollisionReactionMap);
        }
    };
});
System.register("engine/collision/isRectanglesColliding", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function isRectanglesColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }
    exports_7("isRectanglesColliding", isRectanglesColliding);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/collision/CollisionSystem", ["engine/collision/CollisionReactionMap", "engine/collision/isRectanglesColliding"], function (exports_8, context_8) {
    "use strict";
    var CollisionReactionMap_1, isRectanglesColliding_1, CollisionSystem;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (CollisionReactionMap_1_1) {
                CollisionReactionMap_1 = CollisionReactionMap_1_1;
            },
            function (isRectanglesColliding_1_1) {
                isRectanglesColliding_1 = isRectanglesColliding_1_1;
            }
        ],
        execute: function () {
            CollisionSystem = class CollisionSystem {
                constructor() {
                    this.reactions = new CollisionReactionMap_1.CollisionReactionMap();
                    this.hitboxes = [];
                }
                addHitbox(rectangle) {
                    this.hitboxes.push(rectangle);
                }
                _checkCollisions() {
                    const numHitboxes = this.hitboxes.length;
                    for (let i = 0; i < numHitboxes; i++) {
                        const rect1 = this.hitboxes[i].rectangle;
                        for (let j = i + 1; j < numHitboxes; j++) {
                            const rect2 = this.hitboxes[j].rectangle;
                            if (isRectanglesColliding_1.isRectanglesColliding(rect1, rect2)) {
                                this.reactions.triggerReaction(this.hitboxes[i], this.hitboxes[j]);
                            }
                        }
                    }
                }
            };
            exports_8("CollisionSystem", CollisionSystem);
        }
    };
});
System.register("engine/Keyboard", [], function (exports_9, context_9) {
    "use strict";
    var Keyboard;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            Keyboard = class Keyboard {
                constructor() {
                    this.keys = {};
                    this.handlers = {};
                    this.keyupHandler = this.keyupHandler.bind(this);
                    this.keydownHandler = this.keydownHandler.bind(this);
                    console.log(this.keys);
                }
                _startListen() {
                    addEventListener("keyup", this.keyupHandler);
                    addEventListener("keydown", this.keydownHandler);
                }
                _stopListen() {
                    removeEventListener("keyup", this.keyupHandler);
                    removeEventListener("keydown", this.keydownHandler);
                }
                async nextKeydown(keyCodes) {
                    let promiseResFunc;
                    const promise = new Promise(res => {
                        promiseResFunc = res;
                        this.addKeydownHandler(keyCodes, promiseResFunc);
                    });
                    //* Potential problem: removing promise during handler
                    promise.then(() => this.removeKeydownHandler(keyCodes, promiseResFunc));
                    return promise;
                }
                addKeydownHandler(keyCodes, handler) {
                    for (const code of keyCodes) {
                        const existing = this.handlers[code];
                        if (existing) {
                            existing.push(handler);
                        }
                        else {
                            this.handlers[code] = [handler];
                        }
                    }
                }
                removeKeydownHandler(keyCodes, handler) {
                    for (const code of keyCodes) {
                        const existing = this.handlers[code];
                        if (!existing) {
                            throw new Error("Tried to remove handler that doesn't exist");
                        }
                        const index = existing.indexOf(handler);
                        if (index < 0) {
                            throw new Error("Tried to remove handler that doesn't exist");
                        }
                        existing.splice(index, 1);
                    }
                }
                isDown(keyCodes) {
                    for (const code of keyCodes) {
                        if (this.keys[code]) {
                            return true;
                        }
                    }
                    return false;
                }
                keyupHandler(event) {
                    this.keys[event.code] = false;
                }
                keydownHandler(event) {
                    this.keys[event.code] = true;
                    const handlers = this.handlers[event.code];
                    if (handlers) {
                        for (const handler of handlers) {
                            handler(event);
                        }
                    }
                }
            };
            exports_9("Keyboard", Keyboard);
        }
    };
});
System.register("engine/Mouse", [], function (exports_10, context_10) {
    "use strict";
    var Mouse;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            Mouse = class Mouse {
                constructor() {
                    this.leftDown = false;
                    this.rightDown = false;
                    this.x = 0;
                    this.y = 0;
                    this.mouseupHandler = this.mouseupHandler.bind(this);
                    this.mousedownHandler = this.mousedownHandler.bind(this);
                    this.mousemoveHandler = this.mousemoveHandler.bind(this);
                    this.contextmenuHandler = this.contextmenuHandler.bind(this);
                }
                _startListen() {
                    addEventListener("mouseup", this.mouseupHandler);
                    addEventListener("mousedown", this.mousedownHandler);
                    addEventListener("mousemove", this.mousemoveHandler);
                    addEventListener("contextmenu", this.contextmenuHandler);
                }
                _stopListen() {
                    removeEventListener("mouseup", this.mouseupHandler);
                    removeEventListener("mousedown", this.mousedownHandler);
                    removeEventListener("mousemove", this.mousemoveHandler);
                    removeEventListener("contextmenu", this.contextmenuHandler);
                }
                mouseupHandler(event) {
                    if (event.button === 0) {
                        this.leftDown = false;
                    }
                    else if (event.button === 2) {
                        this.rightDown = false;
                    }
                }
                mousedownHandler(event) {
                    if (event.button === 0) {
                        this.leftDown = true;
                    }
                    else {
                        this.rightDown = true;
                    }
                }
                mousemoveHandler(event) {
                    this.x = event.clientX;
                    this.y = event.clientY;
                }
                contextmenuHandler(event) {
                    event.preventDefault();
                }
            };
            exports_10("Mouse", Mouse);
        }
    };
});
System.register("engine/World", ["engine/Camera", "engine/Canvas", "engine/collision/CollisionSystem", "engine/Keyboard", "engine/Mouse"], function (exports_11, context_11) {
    "use strict";
    var Camera_1, Canvas_1, CollisionSystem_1, Keyboard_1, Mouse_1, World;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (Canvas_1_1) {
                Canvas_1 = Canvas_1_1;
            },
            function (CollisionSystem_1_1) {
                CollisionSystem_1 = CollisionSystem_1_1;
            },
            function (Keyboard_1_1) {
                Keyboard_1 = Keyboard_1_1;
            },
            function (Mouse_1_1) {
                Mouse_1 = Mouse_1_1;
            }
        ],
        execute: function () {
            World = class World {
                constructor() {
                    this.canvas = new Canvas_1.Canvas();
                    this.camera = new Camera_1.Camera(this);
                    this.keyboard = new Keyboard_1.Keyboard();
                    this.mouse = new Mouse_1.Mouse();
                    this.collisionSystem = new CollisionSystem_1.CollisionSystem();
                    this.timeElapsed = 0;
                    this.elms = [];
                    this.lastTime = performance.now();
                    this.maxTickTimeElapse = 0.020;
                    this.canvas.resizeToScreen();
                }
                startListen() {
                    this.keyboard._startListen();
                    this.mouse._startListen();
                    this.canvas._startAutoResize();
                }
                stopListen() {
                    this.keyboard._stopListen();
                    this.mouse._stopListen();
                    this.canvas._stopAutoResize();
                }
                addElm(elm) {
                    elm.setWorld(this);
                    this.elms.push(elm);
                }
                removeElm(elm) {
                    elm.dispose();
                    const index = this.elms.indexOf(elm);
                    if (index < 0) {
                        throw new Error("Tried removing element that wasn't added");
                    }
                    this.elms.splice(index, 1);
                }
                draw() {
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
                tick() {
                    for (const elm of this.elms) {
                        elm.tick();
                    }
                    this.collisionSystem._checkCollisions();
                }
                appendTo(parent) {
                    this.canvas.appendTo(parent);
                }
            };
            exports_11("World", World);
        }
    };
});
System.register("engine/util/MovingRectangle", ["engine/util/Rectangle"], function (exports_12, context_12) {
    "use strict";
    var Rectangle_1, MovingRectangle;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (Rectangle_1_1) {
                Rectangle_1 = Rectangle_1_1;
            }
        ],
        execute: function () {
            MovingRectangle = class MovingRectangle extends Rectangle_1.Rectangle {
                constructor(x, y, width, height) {
                    super(x, y, width, height);
                    this.lastX = x;
                    this.lastY = y;
                }
                setLasts() {
                    this.lastX = this.x;
                    this.lastY = this.y;
                }
            };
            exports_12("MovingRectangle", MovingRectangle);
        }
    };
});
System.register("entities/Entity", ["engine/CanvasElm", "engine/collision/Hitbox", "engine/util/Rectangle", "entities/collisions"], function (exports_13, context_13) {
    "use strict";
    var CanvasElm_1, Hitbox_1, Rectangle_2, collisions_1, Entity;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (CanvasElm_1_1) {
                CanvasElm_1 = CanvasElm_1_1;
            },
            function (Hitbox_1_1) {
                Hitbox_1 = Hitbox_1_1;
            },
            function (Rectangle_2_1) {
                Rectangle_2 = Rectangle_2_1;
            },
            function (collisions_1_1) {
                collisions_1 = collisions_1_1;
            }
        ],
        execute: function () {
            Entity = class Entity extends CanvasElm_1.CanvasElm {
                constructor() {
                    super(...arguments);
                    this.rect = new Rectangle_2.Rectangle(0, 0, 24, 24);
                    this.collisionType = collisions_1.collisions.types.static;
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.collisionSystem.addHitbox(new Hitbox_1.Hitbox(this.rect, this));
                }
                dispose() {
                    throw new Error("Not implemented");
                }
            };
            exports_13("Entity", Entity);
        }
    };
});
System.register("engine/PrerenderCanvas", [], function (exports_14, context_14) {
    "use strict";
    var PrerenderCanvas;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            PrerenderCanvas = class PrerenderCanvas {
                constructor(width, height) {
                    this.canvas = document.createElement("canvas");
                    this.X = this.canvas.getContext("2d");
                    this.resize(width, height);
                }
                drawToContext(X, x, y) {
                    X.drawImage(this.canvas, x, y, this.width, this.height);
                }
                resize(width, height) {
                    const dpr = window.devicePixelRatio || 1;
                    this.width = width;
                    this.height = height;
                    this.canvas.width = dpr * width;
                    this.canvas.height = dpr * height;
                    this.X.resetTransform();
                    this.X.scale(dpr, dpr);
                }
                clear() {
                    this.X.clearRect(0, 0, this.width, this.height);
                }
            };
            exports_14("PrerenderCanvas", PrerenderCanvas);
        }
    };
});
System.register("resources/resourceFetcher", [], function (exports_15, context_15) {
    "use strict";
    var ResourceFetcher, resourceFetcher;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            ResourceFetcher = class ResourceFetcher {
                constructor() {
                    this.cache = new Map();
                }
                async fetch(url) {
                    const cached = this.cache.get(url);
                    if (cached) {
                        return cached;
                    }
                    else {
                        const response = await fetch(url);
                        const result = await response.text();
                        this.cache.set(url, result);
                        return result;
                    }
                }
            };
            exports_15("resourceFetcher", resourceFetcher = new ResourceFetcher());
        }
    };
});
System.register("entities/TileMap", ["engine/PrerenderCanvas", "engine/util/Rectangle", "resources/resourceFetcher", "entities/collisions", "entities/Entity"], function (exports_16, context_16) {
    "use strict";
    var PrerenderCanvas_1, Rectangle_3, resourceFetcher_1, collisions_2, Entity_1, TileMap;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (PrerenderCanvas_1_1) {
                PrerenderCanvas_1 = PrerenderCanvas_1_1;
            },
            function (Rectangle_3_1) {
                Rectangle_3 = Rectangle_3_1;
            },
            function (resourceFetcher_1_1) {
                resourceFetcher_1 = resourceFetcher_1_1;
            },
            function (collisions_2_1) {
                collisions_2 = collisions_2_1;
            },
            function (Entity_1_1) {
                Entity_1 = Entity_1_1;
            }
        ],
        execute: function () {
            TileMap = class TileMap extends Entity_1.Entity {
                constructor() {
                    super();
                    this.collisionType = collisions_2.collisions.types.map;
                    this.tileSize = 32;
                    resourceFetcher_1.resourceFetcher.fetch("assets/maze.txt").then(str => {
                        this.map = str.split("\n").map(line => line.split("").map(char => char !== " "));
                        this.rect.height = this.map.length * this.tileSize;
                        this.rect.width = this.map[0].length * this.tileSize;
                        this.updatePrerender();
                    });
                }
                draw() {
                    if (!this.prerender) {
                        return;
                    }
                    this.prerender.drawToContext(this.world.canvas.X, this.rect.x, this.rect.y);
                }
                updatePrerender() {
                    if (!this.map) {
                        return;
                    }
                    if (this.prerender) {
                        this.prerender.resize(this.rect.width, this.rect.height);
                        this.prerender.clear();
                    }
                    else {
                        this.prerender = new PrerenderCanvas_1.PrerenderCanvas(this.rect.width, this.rect.height);
                    }
                    const X = this.prerender.X;
                    X.fillStyle = "#aaa8";
                    for (let y = 0; y < this.map.length; y++) {
                        for (let x = 0; x < this.map[y].length; x++) {
                            if (this.map[y][x]) {
                                X.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                            }
                        }
                    }
                }
                setBlock(x, y, block) {
                    if (!this.map) {
                        return;
                    }
                    const xIndex = Math.floor(x / this.tileSize);
                    const yIndex = Math.floor(y / this.tileSize);
                    if (!this.map[yIndex] || this.map[yIndex].length <= xIndex) {
                        return;
                    }
                    this.map[yIndex][xIndex] = block;
                    this.updatePrerender();
                }
                getCollisionTiles(x, y) {
                    if (!this.map) {
                        return;
                    }
                    const xIndex = Math.floor(x / this.tileSize);
                    const yIndex = Math.floor(y / this.tileSize);
                    const rects = [];
                    let capturedTopLeft = false;
                    let capturedTopRight = false;
                    let capturedBottomLeft = false;
                    let capturedBottomRight = false;
                    if (this.isBlock(xIndex, yIndex)) {
                        rects.push(this.rectFromIndexes(xIndex, yIndex));
                    }
                    if (this.isBlock(xIndex - 1, yIndex)) {
                        let rect = this.rectFromIndexes(xIndex - 1, yIndex);
                        if (this.isBlock(xIndex - 1, yIndex - 1)) {
                            rect.y -= this.tileSize;
                            rect.height += this.tileSize;
                            capturedTopLeft = true;
                        }
                        if (this.isBlock(xIndex - 1, yIndex + 1)) {
                            rect.height += this.tileSize;
                            capturedBottomLeft = true;
                        }
                        rects.push(rect);
                    }
                    if (this.isBlock(xIndex + 1, yIndex)) {
                        let rect = this.rectFromIndexes(xIndex + 1, yIndex);
                        if (this.isBlock(xIndex + 1, yIndex - 1)) {
                            rect.y -= this.tileSize;
                            rect.height += this.tileSize;
                            capturedTopRight = true;
                        }
                        if (this.isBlock(xIndex + 1, yIndex + 1)) {
                            rect.height += this.tileSize;
                            capturedBottomRight = true;
                        }
                        rects.push(rect);
                    }
                    if (this.isBlock(xIndex, yIndex + 1)) {
                        let rect = this.rectFromIndexes(xIndex, yIndex + 1);
                        if (this.isBlock(xIndex - 1, yIndex + 1)) {
                            rect.x -= this.tileSize;
                            rect.width += this.tileSize;
                            capturedBottomLeft = true;
                        }
                        if (this.isBlock(xIndex + 1, yIndex + 1)) {
                            rect.width += this.tileSize;
                            capturedBottomRight = true;
                        }
                        rects.push(rect);
                    }
                    if (this.isBlock(xIndex, yIndex - 1)) {
                        let rect = this.rectFromIndexes(xIndex, yIndex - 1);
                        if (this.isBlock(xIndex - 1, yIndex - 1)) {
                            rect.x -= this.tileSize;
                            rect.width += this.tileSize;
                            capturedTopLeft = true;
                        }
                        if (this.isBlock(xIndex + 1, yIndex - 1)) {
                            rect.width += this.tileSize;
                            capturedTopRight = true;
                        }
                        rects.push(rect);
                    }
                    if (!capturedBottomLeft && this.isBlock(xIndex - 1, yIndex + 1)) {
                        rects.push(this.rectFromIndexes(xIndex - 1, yIndex + 1));
                    }
                    if (!capturedBottomRight && this.isBlock(xIndex + 1, yIndex + 1)) {
                        rects.push(this.rectFromIndexes(xIndex + 1, yIndex + 1));
                    }
                    if (!capturedTopLeft && this.isBlock(xIndex - 1, yIndex - 1)) {
                        rects.push(this.rectFromIndexes(xIndex - 1, yIndex - 1));
                    }
                    if (!capturedTopRight && this.isBlock(xIndex + 1, yIndex - 1)) {
                        rects.push(this.rectFromIndexes(xIndex + 1, yIndex - 1));
                    }
                    return rects;
                }
                isBlock(xIndex, yIndex) {
                    if (!this.map) {
                        return false;
                    }
                    return this.map[yIndex] && this.map[yIndex][xIndex];
                }
                rectFromIndexes(xIndex, yIndex) {
                    return new Rectangle_3.Rectangle(xIndex * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
                }
            };
            exports_16("TileMap", TileMap);
        }
    };
});
System.register("entities/collisions", ["engine/collision/isRectanglesColliding", "engine/util/MovingRectangle"], function (exports_17, context_17) {
    "use strict";
    var isRectanglesColliding_2, MovingRectangle_1, collisions;
    var __moduleName = context_17 && context_17.id;
    function registerCollisions(collisionReactionMap) {
        collisionReactionMap.setCollisionReaction(collisions.types.moving, collisions.types.static, function (moving, block) {
            handleMovingStaticCollision(moving.rectangle, block.rectangle);
        });
        collisionReactionMap.setCollisionReaction(collisions.types.map, collisions.types.moving, function (map, moving) {
            const closestBlocks = map.elm.getCollisionTiles(moving.rectangle.x + moving.rectangle.width / 2, moving.rectangle.y + moving.rectangle.height / 2);
            if (!closestBlocks) {
                return;
            }
            for (const block of closestBlocks) {
                if (isRectanglesColliding_2.isRectanglesColliding(block, moving.rectangle)) {
                    handleMovingStaticCollision(moving.rectangle, block);
                }
            }
        });
    }
    exports_17("registerCollisions", registerCollisions);
    function handleMovingStaticCollision(moving, block) {
        // modified from https://stackoverflow.com/a/29861691
        let dx, dy;
        if (moving instanceof MovingRectangle_1.MovingRectangle) {
            dx = (moving.lastX + moving.width / 2)
                - (block.x + block.width / 2);
            dy = (moving.lastY + moving.height / 2)
                - (block.y + block.height / 2);
        }
        else {
            dx = (moving.x + moving.width / 2)
                - (block.x + block.width / 2);
            dy = (moving.y + moving.height / 2)
                - (block.y + block.height / 2);
        }
        const avgWidth = (moving.width + block.width) / 2;
        const avgHeight = (moving.height + block.height) / 2;
        const crossWidth = avgWidth * dy;
        const crossHeight = avgHeight * dx;
        if (crossWidth > crossHeight) {
            if (crossWidth > -crossHeight) {
                // collision at bottom of block
                moving.y = block.y + block.height;
            }
            else {
                // collision at left of block
                moving.x = block.x - moving.width;
            }
        }
        else {
            if (crossWidth > -crossHeight) {
                // collision at right of block
                moving.x = block.x + block.width;
            }
            else {
                // collision at top of block
                moving.y = block.y - moving.height;
            }
        }
    }
    return {
        setters: [
            function (isRectanglesColliding_2_1) {
                isRectanglesColliding_2 = isRectanglesColliding_2_1;
            },
            function (MovingRectangle_1_1) {
                MovingRectangle_1 = MovingRectangle_1_1;
            }
        ],
        execute: function () {
            exports_17("collisions", collisions = {
                types: {
                    static: Symbol(),
                    moving: Symbol(),
                    map: Symbol(),
                    none: Symbol()
                }
            });
        }
    };
});
System.register("engine/ParentCanvasElm", ["engine/CanvasElm"], function (exports_18, context_18) {
    "use strict";
    var CanvasElm_2, ParentCanvasElm;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (CanvasElm_2_1) {
                CanvasElm_2 = CanvasElm_2_1;
            }
        ],
        execute: function () {
            ParentCanvasElm = class ParentCanvasElm extends CanvasElm_2.CanvasElm {
                constructor() {
                    super(...arguments);
                    this.children = [];
                }
                draw() {
                    for (const child of this.children) {
                        child.draw();
                    }
                }
                tick() {
                    for (const child of this.children) {
                        child.tick();
                    }
                }
                setWorld(world) {
                    super.setWorld(world);
                    for (const child of this.children) {
                        child.setWorld(world);
                    }
                }
                dispose() {
                    for (const child of this.children) {
                        child.dispose();
                    }
                }
                addChild(child) {
                    this.children.push(child);
                    if (this.world) {
                        child.setWorld(this.world);
                    }
                }
            };
            exports_18("ParentCanvasElm", ParentCanvasElm);
        }
    };
});
System.register("resources/dialogFetcher", ["resources/resourceFetcher"], function (exports_19, context_19) {
    "use strict";
    var resourceFetcher_2, DialogFetcher, dialogFetcher;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
            function (resourceFetcher_2_1) {
                resourceFetcher_2 = resourceFetcher_2_1;
            }
        ],
        execute: function () {
            DialogFetcher = class DialogFetcher {
                async fetch(url) {
                    const str = await resourceFetcher_2.resourceFetcher.fetch("assets/" + url + ".txt");
                    const lines = str.split("\n");
                    const arr = [];
                    let currArrElm = [];
                    for (const line of lines) {
                        if (line === "") {
                            arr.push(currArrElm.join("\n"));
                            currArrElm.length = 0;
                        }
                        else {
                            currArrElm.push(line);
                        }
                    }
                    if (currArrElm.length) {
                        arr.push(currArrElm.join("\n"));
                    }
                    return arr;
                }
            };
            exports_19("dialogFetcher", dialogFetcher = new DialogFetcher());
        }
    };
});
System.register("settings", [], function (exports_20, context_20) {
    "use strict";
    var settings;
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
            exports_20("settings", settings = {
                keybindings: {
                    moveUp: ["KeyW", "ArrowUp"],
                    moveDown: ["KeyS", "ArrowDown"],
                    moveLeft: ["KeyA", "ArrowLeft"],
                    moveRight: ["KeyD", "ArrowRight"],
                    advanceDialog: ["Enter", "NumpadEnter", "Space"],
                    zoomOut: ["Minus", "NumpadSubtract"],
                    zoomIn: ["Equal", "NumpadAdd"]
                }
            });
        }
    };
});
System.register("ui/NPCDialog", ["engine/CanvasElm", "settings"], function (exports_21, context_21) {
    "use strict";
    var CanvasElm_3, settings_1, NPCDialog;
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [
            function (CanvasElm_3_1) {
                CanvasElm_3 = CanvasElm_3_1;
            },
            function (settings_1_1) {
                settings_1 = settings_1_1;
            }
        ],
        execute: function () {
            NPCDialog = class NPCDialog extends CanvasElm_3.CanvasElm {
                constructor(dialog, rect) {
                    super();
                    this.dialog = dialog;
                    this.rect = rect;
                    this.index = 0;
                    this.advanceDialogHandler = this.advanceDialogHandler.bind(this);
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.keyboard.addKeydownHandler(settings_1.settings.keybindings.advanceDialog, this.advanceDialogHandler);
                }
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#4448";
                    X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                    X.fillStyle = "#aaa";
                    X.font = "24px Arial";
                    X.textBaseline = "top";
                    const lines = this.dialog[this.index].split("\n");
                    for (let y = 0; y < lines.length; y++) {
                        X.fillText(lines[y] || "[...]", this.rect.x + 8, this.rect.y + 8 + y * 36);
                    }
                }
                advanceDialogHandler() {
                    this.index++;
                    if (this.dialog[this.index] === undefined) {
                        this.world.removeElm(this);
                    }
                }
                dispose() {
                    this.world.keyboard.removeKeydownHandler(settings_1.settings.keybindings.advanceDialog, this.advanceDialogHandler);
                    super.dispose();
                }
            };
            exports_21("NPCDialog", NPCDialog);
        }
    };
});
System.register("entities/NPC", ["entities/Entity"], function (exports_22, context_22) {
    "use strict";
    var Entity_2, NPC;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (Entity_2_1) {
                Entity_2 = Entity_2_1;
            }
        ],
        execute: function () {
            NPC = class NPC extends Entity_2.Entity {
                constructor(x, y) {
                    super();
                    this.rect.x = x;
                    this.rect.y = y;
                }
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#0f0";
                    X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                }
            };
            exports_22("NPC", NPC);
        }
    };
});
System.register("entities/Player", ["engine/util/MovingRectangle", "settings", "entities/collisions", "entities/Entity"], function (exports_23, context_23) {
    "use strict";
    var MovingRectangle_2, settings_2, collisions_3, Entity_3, Player;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (MovingRectangle_2_1) {
                MovingRectangle_2 = MovingRectangle_2_1;
            },
            function (settings_2_1) {
                settings_2 = settings_2_1;
            },
            function (collisions_3_1) {
                collisions_3 = collisions_3_1;
            },
            function (Entity_3_1) {
                Entity_3 = Entity_3_1;
            }
        ],
        execute: function () {
            Player = class Player extends Entity_3.Entity {
                constructor() {
                    super();
                    this.collisionType = collisions_3.collisions.types.moving;
                    this.rect = new MovingRectangle_2.MovingRectangle(32, 32, 24, 24);
                    this.speed = 1000;
                }
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#f00";
                    X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                }
                tick() {
                    let dirX = 0;
                    let dirY = 0;
                    if (this.world.keyboard.isDown(settings_2.settings.keybindings.moveLeft)) {
                        dirX--;
                    }
                    if (this.world.keyboard.isDown(settings_2.settings.keybindings.moveRight)) {
                        dirX++;
                    }
                    if (this.world.keyboard.isDown(settings_2.settings.keybindings.moveDown)) {
                        dirY++;
                    }
                    if (this.world.keyboard.isDown(settings_2.settings.keybindings.moveUp)) {
                        dirY--;
                    }
                    this.rect.setLasts();
                    if (dirX && dirY) {
                        dirX *= Math.SQRT1_2;
                        dirY *= Math.SQRT1_2;
                    }
                    this.rect.x += dirX * this.speed * this.world.timeElapsed;
                    this.rect.y += dirY * this.speed * this.world.timeElapsed;
                }
            };
            exports_23("Player", Player);
        }
    };
});
System.register("entities/NPCWithDialog", ["engine/util/Rectangle", "resources/dialogFetcher", "ui/NPCDialog", "entities/NPC", "entities/Player"], function (exports_24, context_24) {
    "use strict";
    var Rectangle_4, dialogFetcher_1, NPCDialog_1, NPC_1, Player_1, NPCWithDialog;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (Rectangle_4_1) {
                Rectangle_4 = Rectangle_4_1;
            },
            function (dialogFetcher_1_1) {
                dialogFetcher_1 = dialogFetcher_1_1;
            },
            function (NPCDialog_1_1) {
                NPCDialog_1 = NPCDialog_1_1;
            },
            function (NPC_1_1) {
                NPC_1 = NPC_1_1;
            },
            function (Player_1_1) {
                Player_1 = Player_1_1;
            }
        ],
        execute: function () {
            NPCWithDialog = class NPCWithDialog extends NPC_1.NPC {
                constructor() {
                    super(...arguments);
                    this.dialogOpen = false;
                }
                onCollision(other) {
                    if (!(other instanceof Player_1.Player)) {
                        return;
                    }
                    if (this.dialogOpen) {
                        return;
                    }
                    this.dialogOpen = true;
                    dialogFetcher_1.dialogFetcher.fetch("testDialog").then(dialog => {
                        this.world.addElm(new NPCDialog_1.NPCDialog(dialog, new Rectangle_4.Rectangle(this.rect.x, this.rect.y, 500, 300)));
                    });
                }
                dispose() {
                    throw new Error("Not implemented");
                }
            };
            exports_24("NPCWithDialog", NPCWithDialog);
        }
    };
});
System.register("view/GameView", ["engine/ParentCanvasElm", "entities/NPCWithDialog", "entities/Player", "entities/TileMap"], function (exports_25, context_25) {
    "use strict";
    var ParentCanvasElm_1, NPCWithDialog_1, Player_2, TileMap_1, GameView;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (ParentCanvasElm_1_1) {
                ParentCanvasElm_1 = ParentCanvasElm_1_1;
            },
            function (NPCWithDialog_1_1) {
                NPCWithDialog_1 = NPCWithDialog_1_1;
            },
            function (Player_2_1) {
                Player_2 = Player_2_1;
            },
            function (TileMap_1_1) {
                TileMap_1 = TileMap_1_1;
            }
        ],
        execute: function () {
            GameView = class GameView extends ParentCanvasElm_1.ParentCanvasElm {
                constructor() {
                    super();
                    this.player = new Player_2.Player();
                    this.addChild(this.player);
                    this.addChild(new NPCWithDialog_1.NPCWithDialog(2500, 2500));
                    this.addChild(new TileMap_1.TileMap());
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.camera.follow(this.player.rect);
                }
            };
            exports_25("GameView", GameView);
        }
    };
});
System.register("entities/GhostPlayer", ["entities/collisions", "entities/Player"], function (exports_26, context_26) {
    "use strict";
    var collisions_4, Player_3, GhostPlayer;
    var __moduleName = context_26 && context_26.id;
    return {
        setters: [
            function (collisions_4_1) {
                collisions_4 = collisions_4_1;
            },
            function (Player_3_1) {
                Player_3 = Player_3_1;
            }
        ],
        execute: function () {
            GhostPlayer = class GhostPlayer extends Player_3.Player {
                constructor() {
                    super(...arguments);
                    this.collisionType = collisions_4.collisions.types.none;
                }
            };
            exports_26("GhostPlayer", GhostPlayer);
        }
    };
});
System.register("view/mapEditor/MapEditor", ["engine/ParentCanvasElm", "entities/GhostPlayer", "entities/TileMap", "settings"], function (exports_27, context_27) {
    "use strict";
    var ParentCanvasElm_2, GhostPlayer_1, TileMap_2, settings_3, MapEditor;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (ParentCanvasElm_2_1) {
                ParentCanvasElm_2 = ParentCanvasElm_2_1;
            },
            function (GhostPlayer_1_1) {
                GhostPlayer_1 = GhostPlayer_1_1;
            },
            function (TileMap_2_1) {
                TileMap_2 = TileMap_2_1;
            },
            function (settings_3_1) {
                settings_3 = settings_3_1;
            }
        ],
        execute: function () {
            MapEditor = class MapEditor extends ParentCanvasElm_2.ParentCanvasElm {
                constructor() {
                    super();
                    this.tileMap = new TileMap_2.TileMap();
                    this.ghostPlayer = new GhostPlayer_1.GhostPlayer();
                    this.addChild(this.tileMap);
                    this.addChild(this.ghostPlayer);
                    console.log(this);
                }
                setWorld(world) {
                    super.setWorld(world);
                    this.world.camera.follow(this.ghostPlayer.rect);
                }
                tick() {
                    super.tick();
                    const x = this.world.camera.clientXToWorld(this.world.mouse.x);
                    const y = this.world.camera.clientYToWorld(this.world.mouse.y);
                    if (this.world.mouse.leftDown) {
                        this.tileMap.setBlock(x, y, true);
                    }
                    else if (this.world.mouse.rightDown) {
                        this.tileMap.setBlock(x, y, false);
                    }
                    if (this.world.keyboard.isDown(settings_3.settings.keybindings.zoomOut)) {
                        this.world.camera.scale /= 1.02;
                    }
                    else if (this.world.keyboard.isDown(settings_3.settings.keybindings.zoomIn)) {
                        this.world.camera.scale *= 1.02;
                    }
                }
                exportMap() {
                    // @ts-expect-error -- temporary
                    const map = this.tileMap.map;
                    if (!map) {
                        return;
                    }
                    return map.map(row => row.map(block => block ? "x" : " ").join("")).join("\n");
                }
            };
            exports_27("MapEditor", MapEditor);
        }
    };
});
System.register("index", ["engine/World", "entities/collisions", "view/GameView", "view/mapEditor/MapEditor"], function (exports_28, context_28) {
    "use strict";
    var World_1, collisions_5, GameView_1, MapEditor_1, world;
    var __moduleName = context_28 && context_28.id;
    function requanf() {
        world.draw();
        requestAnimationFrame(requanf);
    }
    return {
        setters: [
            function (World_1_1) {
                World_1 = World_1_1;
            },
            function (collisions_5_1) {
                collisions_5 = collisions_5_1;
            },
            function (GameView_1_1) {
                GameView_1 = GameView_1_1;
            },
            function (MapEditor_1_1) {
                MapEditor_1 = MapEditor_1_1;
            }
        ],
        execute: function () {
            world = new World_1.World();
            collisions_5.registerCollisions(world.collisionSystem.reactions);
            world.appendTo(document.body);
            world.startListen();
            if (location.hash == "#mapEditor") {
                world.addElm(new MapEditor_1.MapEditor());
            }
            else {
                world.addElm(new GameView_1.GameView());
            }
            requanf();
        }
    };
});
