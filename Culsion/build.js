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
System.register("engine/util/removeElmFromArray", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function removeElmFromArray(elm, array) {
        const index = array.indexOf(elm);
        if (index < 0) {
            throw new Error("Tried to remove element not in array");
        }
        array.splice(index, 1);
    }
    exports_5("removeElmFromArray", removeElmFromArray);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/collision/Hitbox", [], function (exports_6, context_6) {
    "use strict";
    var Hitbox;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Hitbox = class Hitbox {
                constructor(rectangle, elm) {
                    this.rectangle = rectangle;
                    this.elm = elm;
                }
            };
            exports_6("Hitbox", Hitbox);
        }
    };
});
System.register("engine/collision/CollisionReactionMap", [], function (exports_7, context_7) {
    "use strict";
    var CollisionReactionMap;
    var __moduleName = context_7 && context_7.id;
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
            exports_7("CollisionReactionMap", CollisionReactionMap);
        }
    };
});
System.register("engine/collision/isRectanglesColliding", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function isRectanglesColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }
    exports_8("isRectanglesColliding", isRectanglesColliding);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/collision/CollisionSystem", ["engine/util/removeElmFromArray", "engine/collision/CollisionReactionMap", "engine/collision/isRectanglesColliding"], function (exports_9, context_9) {
    "use strict";
    var removeElmFromArray_1, CollisionReactionMap_1, isRectanglesColliding_1, CollisionSystem;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (removeElmFromArray_1_1) {
                removeElmFromArray_1 = removeElmFromArray_1_1;
            },
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
                removeHitbox(rectangle) {
                    removeElmFromArray_1.removeElmFromArray(rectangle, this.hitboxes);
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
            exports_9("CollisionSystem", CollisionSystem);
        }
    };
});
System.register("engine/elements", [], function (exports_10, context_10) {
    "use strict";
    var Elm, InputElm, Component;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Helper class for constructing element trees
             * Version 1.4 (typescript)
             */
            Elm = class Elm {
                constructor(tagNameOrElement) {
                    if (typeof tagNameOrElement === "undefined") {
                        // @ts-ignore
                        this.elm = document.createElement("div");
                    }
                    else if (typeof tagNameOrElement === "string") {
                        this.elm = document.createElement(tagNameOrElement);
                    }
                    else {
                        this.elm = tagNameOrElement;
                    }
                }
                withSelf(func) {
                    func(this);
                    return this;
                }
                class(...classNames) {
                    this.elm.classList.add(...classNames);
                    return this;
                }
                removeClass(className) {
                    this.elm.classList.remove(className);
                }
                append(...elms) {
                    for (const elm of elms) {
                        this.elm.appendChild(this._anyToNode(elm));
                    }
                    return this;
                }
                appendAsFirst(elm) {
                    this.elm.insertBefore(this._anyToNode(elm), this.elm.firstChild);
                }
                appendTo(parent) {
                    if (parent instanceof Elm) {
                        parent.append(this.elm);
                    }
                    else {
                        parent.appendChild(this.elm);
                    }
                    return this;
                }
                clear() {
                    while (this.elm.firstChild) {
                        this.elm.removeChild(this.elm.firstChild);
                    }
                }
                replaceContents(...elms) {
                    this.clear();
                    this.append(...elms);
                }
                remove() {
                    const parent = this.elm.parentElement;
                    if (parent) {
                        parent.removeChild(this.elm);
                    }
                }
                on(event, handler) {
                    // @ts-ignore
                    this.elm.addEventListener(event, handler);
                    return this;
                }
                /**
                 * By click or keyboard
                 */
                onActivate(handler) {
                    this.on("click", handler);
                    this.on("keydown", e => {
                        if (e.target !== this.elm) {
                            return;
                        }
                        if (e.keyCode === 13 || e.keyCode === 32) { // enter or space
                            handler.call(this.elm, e);
                            e.preventDefault();
                        }
                    });
                    return this;
                }
                attribute(key, value) {
                    this.elm.setAttribute(key, value || "true");
                    return this;
                }
                getHTMLElement() {
                    return this.elm;
                }
                _anyToNode(any) {
                    if (any instanceof Elm) {
                        return any.elm;
                    }
                    else if (typeof any === "string") {
                        return document.createTextNode(any);
                    }
                    else if (any instanceof Node) {
                        return any;
                    }
                    else if (any instanceof Component) {
                        return any.elm.elm;
                    }
                    else if (any !== undefined && any !== null) {
                        return document.createTextNode(any.toString());
                    }
                    else {
                        return document.createTextNode("");
                    }
                }
            };
            exports_10("Elm", Elm);
            InputElm = class InputElm extends Elm {
                constructor() {
                    super("input");
                }
                setType(type) {
                    this.elm.type = type;
                    return this;
                }
                getValue() {
                    if (this.elm.type === "checkbox") {
                        return this.elm.checked;
                    }
                    else {
                        return this.elm.value;
                    }
                }
                setValue(value) {
                    if (this.elm.type === "checkbox" && typeof value === "boolean") {
                        this.elm.checked = value;
                    }
                    else if (this.elm.type === "number" && typeof value === "number") {
                        this.elm.value = value.toString();
                    }
                    else {
                        this.elm.value = value.toString();
                    }
                    return this;
                }
            };
            exports_10("InputElm", InputElm);
            Component = class Component {
                constructor(name) {
                    this.name = name;
                    this.elm = new Elm();
                    this.elm.class(name);
                }
                appendTo(parent) {
                    this.elm.appendTo(parent);
                    return this;
                }
            };
            exports_10("Component", Component);
        }
    };
});
System.register("engine/HTMLOverlay", ["engine/elements"], function (exports_11, context_11) {
    "use strict";
    var elements_1, HTMLOverlay;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (elements_1_1) {
                elements_1 = elements_1_1;
            }
        ],
        execute: function () {
            HTMLOverlay = class HTMLOverlay extends elements_1.Component {
                constructor() {
                    super("HTMLOverlay");
                    this.elm.on("mousedown", e => e.stopPropagation());
                }
            };
            exports_11("HTMLOverlay", HTMLOverlay);
        }
    };
});
System.register("engine/Keyboard", [], function (exports_12, context_12) {
    "use strict";
    var Keyboard;
    var __moduleName = context_12 && context_12.id;
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
            exports_12("Keyboard", Keyboard);
        }
    };
});
System.register("engine/Mouse", [], function (exports_13, context_13) {
    "use strict";
    var Mouse;
    var __moduleName = context_13 && context_13.id;
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
            exports_13("Mouse", Mouse);
        }
    };
});
System.register("engine/World", ["engine/Camera", "engine/Canvas", "engine/collision/CollisionSystem", "engine/HTMLOverlay", "engine/Keyboard", "engine/Mouse"], function (exports_14, context_14) {
    "use strict";
    var Camera_1, Canvas_1, CollisionSystem_1, HTMLOverlay_1, Keyboard_1, Mouse_1, World;
    var __moduleName = context_14 && context_14.id;
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
            function (HTMLOverlay_1_1) {
                HTMLOverlay_1 = HTMLOverlay_1_1;
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
                    this.htmlOverlay = new HTMLOverlay_1.HTMLOverlay();
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
                addElm(elm, index) {
                    elm.setWorld(this);
                    //* temporary -- introduce zIndex
                    if (index !== undefined) {
                        this.elms.splice(index, 0, elm);
                    }
                    else {
                        this.elms.push(elm);
                    }
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
                    this.htmlOverlay.appendTo(parent);
                }
            };
            exports_14("World", World);
        }
    };
});
System.register("engine/util/MovingRectangle", ["engine/util/Rectangle"], function (exports_15, context_15) {
    "use strict";
    var Rectangle_1, MovingRectangle;
    var __moduleName = context_15 && context_15.id;
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
            exports_15("MovingRectangle", MovingRectangle);
        }
    };
});
System.register("entities/Entity", ["engine/CanvasElm", "engine/collision/Hitbox", "engine/util/Rectangle", "entities/collisions"], function (exports_16, context_16) {
    "use strict";
    var CanvasElm_1, Hitbox_1, Rectangle_2, collisions_1, Entity;
    var __moduleName = context_16 && context_16.id;
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
                    this.hitbox = new Hitbox_1.Hitbox(this.rect, this);
                    world.collisionSystem.addHitbox(this.hitbox);
                }
                dispose() {
                    this.world.collisionSystem.removeHitbox(this.hitbox);
                }
            };
            exports_16("Entity", Entity);
        }
    };
});
System.register("engine/PrerenderCanvas", [], function (exports_17, context_17) {
    "use strict";
    var PrerenderCanvas;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [],
        execute: function () {
            PrerenderCanvas = class PrerenderCanvas {
                constructor(width, height) {
                    this.canvas = document.createElement("canvas");
                    this.X = this.canvas.getContext("2d");
                    this.resize(width, height);
                }
                drawToContext(X, x, y, width, height) {
                    X.drawImage(this.canvas, x, y, width || this.width, height || this.height);
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
            exports_17("PrerenderCanvas", PrerenderCanvas);
        }
    };
});
System.register("resources/resourceFetcher", [], function (exports_18, context_18) {
    "use strict";
    var ResourceFetcher, resourceFetcher;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [],
        execute: function () {
            ResourceFetcher = class ResourceFetcher {
                constructor() {
                    this.cache = new Map();
                }
                async fetchText(url) {
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
                async fetchRaw(url) {
                    const cached = this.cache.get(url);
                    if (cached) {
                        return cached;
                    }
                    else {
                        const response = await fetch(url);
                        const result = await (await response.blob()).arrayBuffer();
                        this.cache.set(url, result);
                        return result;
                    }
                }
                async fetchImg(url) {
                    const cached = this.cache.get(url);
                    if (cached) {
                        return cached;
                    }
                    else {
                        const result = await new Promise((res, rej) => {
                            const img = document.createElement("img");
                            img.src = url;
                            img.addEventListener("load", function () {
                                res(img);
                            });
                            img.addEventListener("error", function (err) {
                                rej(err);
                            });
                        });
                        this.cache.set(url, result);
                        return result;
                    }
                }
            };
            exports_18("resourceFetcher", resourceFetcher = new ResourceFetcher());
        }
    };
});
/**
 * Map file structure:
 *
 * 1 byte - version number (1)
 * 4 bytes - width
 * 4 bytes - height
 * width * height bytes - map data
 * rest of file - JSON data:
 *   {
 *     blockTypes: [blockType, blockType, blockType, ...],
 *     joints: [joint, joint, ...]
 *     entities: [ ... ]
 *   }
 */
System.register("resources/TileMapFile", [], function (exports_19, context_19) {
    "use strict";
    var TileMapFile, DataViewWalker;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
            TileMapFile = class TileMapFile {
                static fromBuffer(buffer) {
                    const mapFile = new TileMapFile();
                    const dataWalker = new DataViewWalker(buffer);
                    mapFile.version = dataWalker.nextUint8();
                    mapFile.width = dataWalker.nextUint32();
                    mapFile.height = dataWalker.nextUint32();
                    mapFile.mapData = dataWalker.nextUint8Array(mapFile.width * mapFile.height);
                    const textDecoder = new TextDecoder();
                    mapFile.jsonData = JSON.parse(textDecoder.decode(dataWalker.nextUint8Array()));
                    return mapFile;
                }
                static create(width, height) {
                    const mapFile = new TileMapFile();
                    mapFile.version = 1;
                    mapFile.width = width;
                    mapFile.height = height;
                    mapFile.mapData = new Uint8Array(width * height);
                    mapFile.jsonData = {};
                    return mapFile;
                }
                encode() {
                    const version = new Uint8Array(1);
                    version[0] = this.version;
                    const widthHeight = new Uint32Array(2);
                    widthHeight[0] = this.width;
                    widthHeight[1] = this.height;
                    const jsonDataStr = JSON.stringify(this.jsonData);
                    return new Blob([version, widthHeight, this.mapData, jsonDataStr]);
                }
            };
            exports_19("TileMapFile", TileMapFile);
            DataViewWalker = class DataViewWalker {
                constructor(buffer) {
                    this.currOffset = 0;
                    this.dataWalker = new DataView(buffer);
                }
                nextUint8() {
                    const val = this.dataWalker.getUint8(this.currOffset);
                    this.currOffset += 1;
                    return val;
                }
                nextUint8Array(length) {
                    if (length) {
                        const arr = new Uint8Array(this.dataWalker.buffer, this.currOffset, length);
                        this.currOffset += length;
                        return arr;
                    }
                    else {
                        const arr = new Uint8Array(this.dataWalker.buffer, this.currOffset);
                        this.currOffset = this.dataWalker.byteLength;
                        return arr;
                    }
                }
                nextUint32() {
                    const val = this.dataWalker.getUint32(this.currOffset, true);
                    this.currOffset += 4;
                    return val;
                }
            };
        }
    };
});
System.register("entities/TileMap", ["engine/PrerenderCanvas", "engine/util/Rectangle", "resources/resourceFetcher", "resources/TileMapFile", "entities/collisions", "entities/Entity"], function (exports_20, context_20) {
    "use strict";
    var PrerenderCanvas_1, Rectangle_3, resourceFetcher_1, TileMapFile_1, collisions_2, Entity_1, TileMap;
    var __moduleName = context_20 && context_20.id;
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
            function (TileMapFile_1_1) {
                TileMapFile_1 = TileMapFile_1_1;
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
                constructor(tileMapFile) {
                    super();
                    this.collisionType = collisions_2.collisions.types.map;
                    this.tileSize = 48;
                    this.textures = [];
                    this.tileTextureSize = 12;
                    this.file = tileMapFile;
                    this.width = tileMapFile.width;
                    this.height = tileMapFile.height;
                    this.rect.height = tileMapFile.height * this.tileSize;
                    this.rect.width = tileMapFile.width * this.tileSize;
                    this.map = [];
                    for (let y = 0; y < tileMapFile.height; y++) {
                        const row = [];
                        for (let x = 0; x < tileMapFile.width; x++) {
                            row[x] = tileMapFile.mapData[y * tileMapFile.width + x];
                        }
                        this.map[y] = row;
                    }
                    this.blockTypes = tileMapFile.jsonData.blockTypes || [];
                    this.prerender = new PrerenderCanvas_1.PrerenderCanvas(this.rect.width, this.rect.height);
                    this.loadTextures().then(() => this.updatePrerender());
                }
                setWorld(world) {
                    super.setWorld(world);
                }
                draw() {
                    this.world.canvas.X.imageSmoothingEnabled = false;
                    this.prerender.drawToContext(this.world.canvas.X, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                }
                updatePrerender() {
                    this.prerender.resize(this.width * this.tileTextureSize, this.height * this.tileTextureSize);
                    this.prerender.clear();
                    const X = this.prerender.X;
                    X.imageSmoothingEnabled = false;
                    for (let y = 0; y < this.height; y++) {
                        for (let x = 0; x < this.width; x++) {
                            const blockTypeIndex = this.map[y][x];
                            if (this.textures[blockTypeIndex]) {
                                X.drawImage(this.textures[blockTypeIndex], x * this.tileTextureSize, y * this.tileTextureSize);
                            }
                            else {
                                X.fillStyle = this.blockTypes[blockTypeIndex].color;
                                X.fillRect(x * this.tileTextureSize, y * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
                            }
                        }
                    }
                }
                updatePrerenderTile(xIndex, yIndex) {
                    const X = this.prerender.X;
                    X.imageSmoothingEnabled = false;
                    const blockTypeIndex = this.map[yIndex][xIndex];
                    if (this.textures[blockTypeIndex]) {
                        X.drawImage(this.textures[blockTypeIndex], xIndex * this.tileTextureSize, yIndex * this.tileTextureSize);
                    }
                    else {
                        X.clearRect(xIndex * this.tileTextureSize, yIndex * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
                        X.fillStyle = this.blockTypes[blockTypeIndex].color;
                        X.fillRect(xIndex * this.tileTextureSize, yIndex * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
                    }
                }
                setBlock(x, y, block) {
                    const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
                    const yIndex = Math.floor((y - this.rect.y) / this.tileSize);
                    if (!this.map[yIndex] || this.map[yIndex].length <= xIndex) {
                        return;
                    }
                    this.map[yIndex][xIndex] = block;
                    this.updatePrerenderTile(xIndex, yIndex);
                }
                _getJoints() {
                    return this.file.jsonData.joints || [];
                }
                _getJointById(id) {
                    if (!this.file.jsonData.joints) {
                        return;
                    }
                    for (const joint of this.file.jsonData.joints) {
                        if (joint.id === id) {
                            return joint;
                        }
                    }
                }
                getBlockTypes() {
                    return this.blockTypes;
                }
                getWidth() {
                    return this.width;
                }
                getHeight() {
                    return this.height;
                }
                resize(newWidth, newHeight) {
                    for (let y = 0; y < this.height; y++) {
                        for (let x = this.width; x < newWidth; x++) {
                            this.map[y][x] = 0;
                        }
                        this.map[y].length = newWidth;
                    }
                    for (let y = this.height; y < newHeight; y++) {
                        const newRow = [];
                        for (let x = 0; x < newWidth; x++) {
                            newRow[x] = 0;
                        }
                        this.map[y] = newRow;
                    }
                    this.map.length = newHeight;
                    this.width = newWidth;
                    this.height = newHeight;
                    this.rect.width = this.width * this.tileSize;
                    this.rect.height = this.height * this.tileSize;
                    this.updatePrerender();
                }
                exportTileMapFile() {
                    const width = this.map[0].length;
                    const height = this.map.length;
                    const file = TileMapFile_1.TileMapFile.create(width, height);
                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            file.mapData[y * width + x] = this.map[y][x];
                        }
                    }
                    file.jsonData = this.file.jsonData;
                    return file;
                }
                getCollisionTiles(x, y) {
                    const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
                    const yIndex = Math.floor((y - this.rect.y) / this.tileSize);
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
                    return xIndex < this.width && xIndex >= 0 &&
                        yIndex < this.height && yIndex >= 0 &&
                        this.blockTypes[this.map[yIndex][xIndex]].solid;
                }
                rectFromIndexes(xIndex, yIndex) {
                    return new Rectangle_3.Rectangle(xIndex * this.tileSize + this.rect.x, yIndex * this.tileSize + this.rect.y, this.tileSize, this.tileSize);
                }
                async loadTextures() {
                    const proms = [];
                    for (let i = 0; i < this.blockTypes.length; i++) {
                        const blockType = this.blockTypes[i];
                        if (blockType.texture) {
                            proms.push(resourceFetcher_1.resourceFetcher.fetchImg("assets/img/tile/" + blockType.texture + ".png")
                                .then(img => this.textures[i] = img));
                        }
                        else {
                            this.textures[i] = null;
                        }
                    }
                    await Promise.all(proms);
                }
            };
            exports_20("TileMap", TileMap);
        }
    };
});
System.register("entities/collisions", ["engine/collision/isRectanglesColliding", "engine/util/MovingRectangle"], function (exports_21, context_21) {
    "use strict";
    var isRectanglesColliding_2, MovingRectangle_1, collisions;
    var __moduleName = context_21 && context_21.id;
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
    exports_21("registerCollisions", registerCollisions);
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
            exports_21("collisions", collisions = {
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
System.register("engine/ParentCanvasElm", ["engine/CanvasElm", "engine/util/removeElmFromArray"], function (exports_22, context_22) {
    "use strict";
    var CanvasElm_2, removeElmFromArray_2, ParentCanvasElm;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (CanvasElm_2_1) {
                CanvasElm_2 = CanvasElm_2_1;
            },
            function (removeElmFromArray_2_1) {
                removeElmFromArray_2 = removeElmFromArray_2_1;
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
                removeChild(child) {
                    removeElmFromArray_2.removeElmFromArray(child, this.children);
                    child.dispose();
                }
            };
            exports_22("ParentCanvasElm", ParentCanvasElm);
        }
    };
});
System.register("resources/dialogFetcher", ["resources/resourceFetcher"], function (exports_23, context_23) {
    "use strict";
    var resourceFetcher_2, DialogFetcher, dialogFetcher;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (resourceFetcher_2_1) {
                resourceFetcher_2 = resourceFetcher_2_1;
            }
        ],
        execute: function () {
            DialogFetcher = class DialogFetcher {
                async fetch(url) {
                    const str = await resourceFetcher_2.resourceFetcher.fetchText("assets/" + url + ".txt");
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
            exports_23("dialogFetcher", dialogFetcher = new DialogFetcher());
        }
    };
});
System.register("settings", [], function (exports_24, context_24) {
    "use strict";
    var settings;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [],
        execute: function () {
            exports_24("settings", settings = {
                keybindings: {
                    moveUp: ["KeyW", "ArrowUp"],
                    moveDown: ["KeyS", "ArrowDown"],
                    moveLeft: ["KeyA", "ArrowLeft"],
                    moveRight: ["KeyD", "ArrowRight"],
                    select: ["Enter", "NumpadEnter", "Space", "Z"],
                    zoomOut: ["Minus", "NumpadSubtract"],
                    zoomIn: ["Equal", "NumpadAdd"]
                }
            });
        }
    };
});
System.register("ui/NPCDialog", ["engine/CanvasElm", "settings"], function (exports_25, context_25) {
    "use strict";
    var CanvasElm_3, settings_1, NPCDialog;
    var __moduleName = context_25 && context_25.id;
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
                    world.keyboard.addKeydownHandler(settings_1.settings.keybindings.select, this.advanceDialogHandler);
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
                    this.world.keyboard.removeKeydownHandler(settings_1.settings.keybindings.select, this.advanceDialogHandler);
                    super.dispose();
                }
            };
            exports_25("NPCDialog", NPCDialog);
        }
    };
});
System.register("entities/NPC", ["entities/Entity"], function (exports_26, context_26) {
    "use strict";
    var Entity_2, NPC;
    var __moduleName = context_26 && context_26.id;
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
            exports_26("NPC", NPC);
        }
    };
});
System.register("entities/Player", ["engine/util/MovingRectangle", "settings", "entities/collisions", "entities/Entity"], function (exports_27, context_27) {
    "use strict";
    var MovingRectangle_2, settings_2, collisions_3, Entity_3, Player;
    var __moduleName = context_27 && context_27.id;
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
            exports_27("Player", Player);
        }
    };
});
System.register("entities/NPCWithDialog", ["engine/util/Rectangle", "resources/dialogFetcher", "ui/NPCDialog", "entities/NPC", "entities/Player"], function (exports_28, context_28) {
    "use strict";
    var Rectangle_4, dialogFetcher_1, NPCDialog_1, NPC_1, Player_1, NPCWithDialog;
    var __moduleName = context_28 && context_28.id;
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
            exports_28("NPCWithDialog", NPCWithDialog);
        }
    };
});
System.register("entities/ParentTileMap", ["engine/collision/isRectanglesColliding", "engine/ParentCanvasElm", "engine/util/Rectangle", "engine/util/removeElmFromArray", "resources/resourceFetcher", "resources/TileMapFile", "entities/TileMap"], function (exports_29, context_29) {
    "use strict";
    var isRectanglesColliding_3, ParentCanvasElm_1, Rectangle_5, removeElmFromArray_3, resourceFetcher_3, TileMapFile_2, TileMap_1, ParentTileMap;
    var __moduleName = context_29 && context_29.id;
    return {
        setters: [
            function (isRectanglesColliding_3_1) {
                isRectanglesColliding_3 = isRectanglesColliding_3_1;
            },
            function (ParentCanvasElm_1_1) {
                ParentCanvasElm_1 = ParentCanvasElm_1_1;
            },
            function (Rectangle_5_1) {
                Rectangle_5 = Rectangle_5_1;
            },
            function (removeElmFromArray_3_1) {
                removeElmFromArray_3 = removeElmFromArray_3_1;
            },
            function (resourceFetcher_3_1) {
                resourceFetcher_3 = resourceFetcher_3_1;
            },
            function (TileMapFile_2_1) {
                TileMapFile_2 = TileMapFile_2_1;
            },
            function (TileMap_1_1) {
                TileMap_1 = TileMap_1_1;
            }
        ],
        execute: function () {
            ParentTileMap = class ParentTileMap extends ParentCanvasElm_1.ParentCanvasElm {
                constructor(mapFile, view) {
                    super();
                    this.view = view;
                    this.joinableJoints = [];
                    this.unjoinableJoints = [];
                    this.activeMaps = [];
                    this.addTileMap(new TileMap_1.TileMap(mapFile));
                    console.log(this);
                }
                tick() {
                    super.tick();
                    for (const jointRecord of this.joinableJoints) {
                        if (!isRectanglesColliding_3.isRectanglesColliding(jointRecord.location, this.view)) {
                            continue;
                        }
                        this.setJointRecordUnjoinable(jointRecord);
                        resourceFetcher_3.resourceFetcher.fetchRaw("assets/" + jointRecord.joint.toMap + ".tmap")
                            .then(buffer => {
                            const tileMap = new TileMap_1.TileMap(TileMapFile_2.TileMapFile.fromBuffer(buffer));
                            const newJoint = tileMap._getJointById(jointRecord.joint.toId);
                            if (!newJoint) {
                                throw new Error("Failed to join joints -- could not find target joint.");
                            }
                            const dx = (jointRecord.joint.x - newJoint.x) * jointRecord.map.tileSize + jointRecord.map.rect.x;
                            const dy = (jointRecord.joint.y - newJoint.y) * jointRecord.map.tileSize + jointRecord.map.rect.y;
                            tileMap.rect.x += dx;
                            tileMap.rect.y += dy;
                            const record = this.addTileMap(tileMap, newJoint);
                            record.toMap = jointRecord.map;
                            jointRecord.toMap = record.map;
                        });
                    }
                    for (const jointRecord of this.unjoinableJoints) {
                        if (isRectanglesColliding_3.isRectanglesColliding(jointRecord.location, this.view) ||
                            isRectanglesColliding_3.isRectanglesColliding(jointRecord.map.rect, new Rectangle_5.Rectangle(this.view.x - 20, this.view.y - 20, this.view.width + 40, this.view.height + 40))) {
                            continue;
                        }
                        this.removeMap(jointRecord.map);
                    }
                }
                addTileMap(tileMap, excludeJoint) {
                    const joints = tileMap._getJoints();
                    let excludedJointRecord;
                    for (const joint of joints) {
                        const record = {
                            map: tileMap,
                            joint: joint,
                            location: new Rectangle_5.Rectangle(joint.x * tileMap.tileSize + tileMap.rect.x, joint.y * tileMap.tileSize + tileMap.rect.y, tileMap.tileSize, tileMap.tileSize)
                        };
                        if (joint === excludeJoint) {
                            this.unjoinableJoints.push(record);
                            excludedJointRecord = record;
                        }
                        else {
                            this.joinableJoints.push(record);
                        }
                    }
                    this.activeMaps.push(tileMap);
                    this.addChild(tileMap);
                    return excludedJointRecord;
                }
                setJointRecordUnjoinable(joint) {
                    removeElmFromArray_3.removeElmFromArray(joint, this.joinableJoints);
                    this.unjoinableJoints.push(joint);
                }
                setJointRecordJoinable(joint) {
                    removeElmFromArray_3.removeElmFromArray(joint, this.unjoinableJoints);
                    this.joinableJoints.push(joint);
                }
                removeMap(map) {
                    removeElmFromArray_3.removeElmFromArray(map, this.activeMaps);
                    for (let i = this.joinableJoints.length - 1; i >= 0; i--) {
                        const joint = this.joinableJoints[i];
                        if (joint.map === map) {
                            this.joinableJoints.splice(i, 1);
                        }
                    }
                    for (let j = this.unjoinableJoints.length - 1; j >= 0; j--) {
                        const joint = this.unjoinableJoints[j];
                        if (joint.map === map) {
                            this.unjoinableJoints.splice(j, 1);
                        }
                        else if (joint.toMap === map) {
                            this.setJointRecordJoinable(joint);
                        }
                    }
                    this.removeChild(map);
                }
            };
            exports_29("ParentTileMap", ParentTileMap);
        }
    };
});
System.register("view/GameView", ["engine/ParentCanvasElm", "entities/NPCWithDialog", "entities/ParentTileMap", "entities/Player", "resources/resourceFetcher", "resources/TileMapFile"], function (exports_30, context_30) {
    "use strict";
    var ParentCanvasElm_2, NPCWithDialog_1, ParentTileMap_1, Player_2, resourceFetcher_4, TileMapFile_3, GameView;
    var __moduleName = context_30 && context_30.id;
    return {
        setters: [
            function (ParentCanvasElm_2_1) {
                ParentCanvasElm_2 = ParentCanvasElm_2_1;
            },
            function (NPCWithDialog_1_1) {
                NPCWithDialog_1 = NPCWithDialog_1_1;
            },
            function (ParentTileMap_1_1) {
                ParentTileMap_1 = ParentTileMap_1_1;
            },
            function (Player_2_1) {
                Player_2 = Player_2_1;
            },
            function (resourceFetcher_4_1) {
                resourceFetcher_4 = resourceFetcher_4_1;
            },
            function (TileMapFile_3_1) {
                TileMapFile_3 = TileMapFile_3_1;
            }
        ],
        execute: function () {
            GameView = class GameView extends ParentCanvasElm_2.ParentCanvasElm {
                constructor() {
                    super();
                    this.player = new Player_2.Player();
                    this.addChild(new NPCWithDialog_1.NPCWithDialog(2500, 2500));
                    resourceFetcher_4.resourceFetcher.fetchRaw("assets/mazeSolved.tmap")
                        .then(file => {
                        this.addChild(new ParentTileMap_1.ParentTileMap(TileMapFile_3.TileMapFile.fromBuffer(file), this.player.rect));
                        this.addChild(this.player);
                    });
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.camera.follow(this.player.rect);
                }
            };
            exports_30("GameView", GameView);
        }
    };
});
System.register("entities/GhostPlayer", ["entities/collisions", "entities/Player"], function (exports_31, context_31) {
    "use strict";
    var collisions_4, Player_3, GhostPlayer;
    var __moduleName = context_31 && context_31.id;
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
            exports_31("GhostPlayer", GhostPlayer);
        }
    };
});
System.register("view/mapEditor/MapEditor", ["engine/elements", "engine/ParentCanvasElm", "entities/GhostPlayer", "entities/TileMap", "resources/resourceFetcher", "resources/TileMapFile", "settings"], function (exports_32, context_32) {
    "use strict";
    var elements_2, ParentCanvasElm_3, GhostPlayer_1, TileMap_2, resourceFetcher_5, TileMapFile_4, settings_3, MapEditor, MapEditorOverlay;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (elements_2_1) {
                elements_2 = elements_2_1;
            },
            function (ParentCanvasElm_3_1) {
                ParentCanvasElm_3 = ParentCanvasElm_3_1;
            },
            function (GhostPlayer_1_1) {
                GhostPlayer_1 = GhostPlayer_1_1;
            },
            function (TileMap_2_1) {
                TileMap_2 = TileMap_2_1;
            },
            function (resourceFetcher_5_1) {
                resourceFetcher_5 = resourceFetcher_5_1;
            },
            function (TileMapFile_4_1) {
                TileMapFile_4 = TileMapFile_4_1;
            },
            function (settings_3_1) {
                settings_3 = settings_3_1;
            }
        ],
        execute: function () {
            MapEditor = class MapEditor extends ParentCanvasElm_3.ParentCanvasElm {
                constructor() {
                    super();
                    this.ghostPlayer = new GhostPlayer_1.GhostPlayer();
                    this.overlay = new MapEditorOverlay();
                    resourceFetcher_5.resourceFetcher.fetchRaw("assets/" + prompt("Open map name") + ".tmap")
                        .then(tileMapFile => {
                        this.tileMap = new TileMap_2.TileMap(TileMapFile_4.TileMapFile.fromBuffer(tileMapFile));
                        this.addChild(this.tileMap);
                        this.overlay.setTileMap(this.tileMap);
                    });
                    this.exportMapKeyHandler = this.exportMapKeyHandler.bind(this);
                    this.addChild(this.ghostPlayer);
                    console.log(this);
                }
                setWorld(world) {
                    super.setWorld(world);
                    this.world.camera.follow(this.ghostPlayer.rect);
                    this.world.keyboard.addKeydownHandler(settings_3.settings.keybindings.select, this.exportMapKeyHandler);
                    this.world.htmlOverlay.elm.append(this.overlay);
                }
                dispose() {
                    this.world.keyboard.removeKeydownHandler(settings_3.settings.keybindings.select, this.exportMapKeyHandler);
                    this.overlay.elm.remove();
                }
                tick() {
                    super.tick();
                    if (!this.tileMap) {
                        return;
                    }
                    const x = this.world.camera.clientXToWorld(this.world.mouse.x);
                    const y = this.world.camera.clientYToWorld(this.world.mouse.y);
                    if (this.world.mouse.leftDown) {
                        this.tileMap.setBlock(x, y, this.overlay.selectedBlock);
                    }
                    else if (this.world.mouse.rightDown) {
                        this.tileMap.setBlock(x, y, 0);
                    }
                    if (this.world.keyboard.isDown(settings_3.settings.keybindings.zoomOut)) {
                        this.world.camera.scale /= 1.02;
                    }
                    else if (this.world.keyboard.isDown(settings_3.settings.keybindings.zoomIn)) {
                        this.world.camera.scale *= 1.02;
                    }
                }
                draw() {
                    super.draw();
                    if (!this.tileMap) {
                        return;
                    }
                    const x = this.world.camera.clientXToWorld(this.world.mouse.x);
                    const y = this.world.camera.clientYToWorld(this.world.mouse.y);
                    const xIndex = Math.floor(x / this.tileMap.tileSize);
                    const yIndex = Math.floor(y / this.tileMap.tileSize);
                    this.world.canvas.X.fillStyle = "#ff0000";
                    this.world.canvas.X.font = "12px Arial";
                    this.world.canvas.X.textBaseline = "top";
                    this.world.canvas.X.fillText("(" + xIndex + ", " + yIndex + ")", xIndex * this.tileMap.tileSize, yIndex * this.tileMap.tileSize);
                }
                exportMapKeyHandler() {
                    if (!this.tileMap) {
                        return;
                    }
                    const file = this.tileMap.exportTileMapFile();
                    const blob = file.encode();
                    this.downloadBlob(blob);
                }
                downloadBlob(blob) {
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = "MapEditorExport.tmap";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
            };
            exports_32("MapEditor", MapEditor);
            MapEditorOverlay = class MapEditorOverlay extends elements_2.Component {
                constructor() {
                    super("MapEditorOverlay");
                    this.selectedBlock = 1;
                    this.blockTypeElms = [];
                    this.blockTypesElm = new elements_2.Elm().class("blockTypes")
                        .appendTo(this.elm);
                    this.canvasSizeElm = new elements_2.Elm().class("canvasSize")
                        .on("click", () => this.openChangeMapSizeDialog())
                        .appendTo(this.elm);
                }
                setTileMap(tileMap) {
                    this.tileMap = tileMap;
                    this.setBlockTypes(tileMap.getBlockTypes());
                    this.setCanvasSize(tileMap.getWidth(), tileMap.getHeight());
                }
                setBlockTypes(blockTypes) {
                    for (let i = 0; i < blockTypes.length; i++) {
                        const blockType = blockTypes[i];
                        let elm;
                        if (blockType.texture) {
                            elm = new elements_2.Elm("img").attribute("src", "assets/img/tile/" + blockType.texture + ".png");
                        }
                        else {
                            elm = new elements_2.Elm("div");
                        }
                        elm.class("blockType").attribute("style", "background-color: " + blockType.color);
                        elm.on("click", () => {
                            this.selectBlock(i);
                        });
                        this.blockTypesElm.append(elm);
                        this.blockTypeElms[i] = elm;
                    }
                    this.selectBlock(this.selectedBlock);
                }
                selectBlock(index) {
                    this.blockTypeElms[this.selectedBlock].removeClass("selected");
                    this.selectedBlock = index;
                    this.blockTypeElms[index].class("selected");
                }
                setCanvasSize(width, height) {
                    this.canvasSizeElm.replaceContents(width + "x" + height);
                }
                openChangeMapSizeDialog() {
                    if (!this.tileMap) {
                        return;
                    }
                    //* temporary
                    const newWidth = parseInt(prompt("New width"));
                    if (isNaN(newWidth)) {
                        return;
                    }
                    const newHeight = parseInt(prompt("New height"));
                    if (isNaN(newHeight)) {
                        return;
                    }
                    this.tileMap.resize(newWidth, newHeight);
                    this.setCanvasSize(newWidth, newHeight);
                }
            };
        }
    };
});
System.register("index", ["engine/World", "entities/collisions", "view/GameView", "view/mapEditor/MapEditor"], function (exports_33, context_33) {
    "use strict";
    var World_1, collisions_5, GameView_1, MapEditor_1, world;
    var __moduleName = context_33 && context_33.id;
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
            history.scrollRestoration = "manual";
        }
    };
});
