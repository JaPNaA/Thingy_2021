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
System.register("engine/Camera", ["engine/util/Rectangle"], function (exports_3, context_3) {
    "use strict";
    var Rectangle_1, Camera;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (Rectangle_1_1) {
                Rectangle_1 = Rectangle_1_1;
            }
        ],
        execute: function () {
            Camera = class Camera {
                constructor(world) {
                    this.rect = new Rectangle_1.Rectangle(0, 0, 1, 1);
                    this.scale = 1;
                    this.canvas = world.canvas;
                }
                follow(rect) {
                    this.following = rect;
                }
                clientXToWorld(x) {
                    return this.rect.x + x / this.scale;
                }
                clientYToWorld(y) {
                    return this.rect.y + y / this.scale;
                }
                _applyTransform(context) {
                    context.scale(this.scale, this.scale);
                    context.translate(-this.rect.x, -this.rect.y);
                }
                _update() {
                    this.rect.width = this.canvas.width;
                    this.rect.height = this.canvas.height;
                    if (!this.following) {
                        return;
                    }
                    this.rect.x = this.following.x + this.following.width / 2 - this.rect.width / 2 / this.scale;
                    this.rect.y = this.following.y + this.following.height / 2 - this.rect.height / 2 / this.scale;
                }
            };
            exports_3("Camera", Camera);
        }
    };
});
System.register("engine/util/removeElmFromArray", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function removeElmFromArray(elm, array) {
        const index = array.indexOf(elm);
        if (index < 0) {
            throw new Error("Tried to remove element not in array");
        }
        array.splice(index, 1);
    }
    exports_4("removeElmFromArray", removeElmFromArray);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/EventBus", ["engine/util/removeElmFromArray"], function (exports_5, context_5) {
    "use strict";
    var removeElmFromArray_1, EventBus;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (removeElmFromArray_1_1) {
                removeElmFromArray_1 = removeElmFromArray_1_1;
            }
        ],
        execute: function () {
            EventBus = class EventBus {
                constructor() {
                    this.map = {};
                    this.stoppingPropagation = false;
                }
                /**
                 * Sends a message along the event bus
                 * @param name Name of event
                 * @param data Additional data
                 */
                send(name, data) {
                    const arr = this.map[name];
                    if (!arr) {
                        return;
                    }
                    this.stoppingPropagation = false;
                    for (let i = arr.length - 1; i >= 0; i--) {
                        const handler = arr[i];
                        if (handler instanceof EventBus) {
                            handler.send(name);
                        }
                        else {
                            handler(data);
                        }
                        if (this.stoppingPropagation) {
                            this.stoppingPropagation = false;
                            break;
                        }
                    }
                }
                /**
                 * Stops propagation of any message being sent
                 */
                stopPropagation() {
                    this.stoppingPropagation = true;
                    if (this.parentBus) {
                        this.parentBus.stopPropagation();
                    }
                }
                /**
                 * Subscribe to an event
                 * @param name Name of event
                 * @param handler Event handler
                 */
                subscribe(name, handler) {
                    const existingArr = this.map[name];
                    if (existingArr) {
                        existingArr.push(handler);
                    }
                    else {
                        this.map[name] = [handler];
                        if (this.parentBus) {
                            this.parentBus.subscribe(name, this);
                        }
                    }
                }
                unsubscribe(name, handler) {
                    const arr = this.map[name];
                    if (!arr) {
                        return;
                    }
                    removeElmFromArray_1.removeElmFromArray(handler, arr);
                    if (!arr.length) {
                        this.map[name] = undefined;
                        if (this.parentBus) {
                            this.parentBus.unsubscribe(name, this);
                        }
                    }
                }
                _attach(bus) {
                    this.parentBus = bus;
                    const listeningNames = Object.keys(this.map);
                    for (const name of listeningNames) {
                        bus.subscribe(name, this);
                    }
                }
                _dispose() {
                    if (!this.parentBus) {
                        return;
                    }
                    const listeningNames = Object.keys(this.map);
                    for (const name of listeningNames) {
                        this.parentBus.unsubscribe(name, this);
                    }
                }
            };
            exports_5("EventBus", EventBus);
        }
    };
});
System.register("engine/canvasElm/CanvasElmWithEventBus", ["engine/EventBus", "engine/canvasElm/CanvasElm"], function (exports_6, context_6) {
    "use strict";
    var EventBus_1, CanvasElm_1, CanvasElmWithEventBus;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (EventBus_1_1) {
                EventBus_1 = EventBus_1_1;
            },
            function (CanvasElm_1_1) {
                CanvasElm_1 = CanvasElm_1_1;
            }
        ],
        execute: function () {
            CanvasElmWithEventBus = class CanvasElmWithEventBus extends CanvasElm_1.CanvasElm {
                constructor() {
                    super(...arguments);
                    this.eventBus = new EventBus_1.EventBus();
                }
                dispose() {
                    super.dispose();
                    this.eventBus._dispose();
                }
            };
            exports_6("CanvasElmWithEventBus", CanvasElmWithEventBus);
        }
    };
});
System.register("engine/collision/Hitbox", [], function (exports_7, context_7) {
    "use strict";
    var Hitbox;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            Hitbox = class Hitbox {
                constructor(rectangle, elm) {
                    this.rectangle = rectangle;
                    this.elm = elm;
                }
            };
            exports_7("Hitbox", Hitbox);
        }
    };
});
System.register("engine/collision/CollisionReactionMap", [], function (exports_8, context_8) {
    "use strict";
    var CollisionReactionMap;
    var __moduleName = context_8 && context_8.id;
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
            exports_8("CollisionReactionMap", CollisionReactionMap);
        }
    };
});
System.register("engine/collision/isRectanglesColliding", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function isRectanglesColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }
    exports_9("isRectanglesColliding", isRectanglesColliding);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/collision/CollisionSystem", ["engine/util/removeElmFromArray", "engine/collision/CollisionReactionMap", "engine/collision/isRectanglesColliding"], function (exports_10, context_10) {
    "use strict";
    var removeElmFromArray_2, CollisionReactionMap_1, isRectanglesColliding_1, CollisionSystem;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (removeElmFromArray_2_1) {
                removeElmFromArray_2 = removeElmFromArray_2_1;
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
                    removeElmFromArray_2.removeElmFromArray(rectangle, this.hitboxes);
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
            exports_10("CollisionSystem", CollisionSystem);
        }
    };
});
System.register("engine/elements", [], function (exports_11, context_11) {
    "use strict";
    var Elm, InputElm, Component;
    var __moduleName = context_11 && context_11.id;
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
            exports_11("Elm", Elm);
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
            exports_11("InputElm", InputElm);
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
            exports_11("Component", Component);
        }
    };
});
System.register("engine/HTMLOverlay", ["engine/elements"], function (exports_12, context_12) {
    "use strict";
    var elements_1, HTMLOverlay;
    var __moduleName = context_12 && context_12.id;
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
                    this.elm.on("keydown", e => e.stopPropagation());
                    this.elm.on("keyup", e => e.stopPropagation());
                }
            };
            exports_12("HTMLOverlay", HTMLOverlay);
        }
    };
});
System.register("engine/Keyboard", [], function (exports_13, context_13) {
    "use strict";
    var Keyboard;
    var __moduleName = context_13 && context_13.id;
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
            exports_13("Keyboard", Keyboard);
        }
    };
});
System.register("engine/Mouse", [], function (exports_14, context_14) {
    "use strict";
    var Mouse;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            Mouse = class Mouse {
                constructor(eventBus) {
                    this.eventBus = eventBus;
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
                    this.eventBus.send("mouseup", event);
                }
                mousedownHandler(event) {
                    if (event.button === 0) {
                        this.leftDown = true;
                    }
                    else {
                        this.rightDown = true;
                    }
                    this.eventBus.send("mousedown", event);
                }
                mousemoveHandler(event) {
                    this.x = event.clientX;
                    this.y = event.clientY;
                }
                contextmenuHandler(event) {
                    event.preventDefault();
                }
            };
            exports_14("Mouse", Mouse);
        }
    };
});
System.register("engine/World", ["engine/Camera", "engine/Canvas", "engine/canvasElm/CanvasElmWithEventBus", "engine/collision/CollisionSystem", "engine/EventBus", "engine/HTMLOverlay", "engine/Keyboard", "engine/Mouse"], function (exports_15, context_15) {
    "use strict";
    var Camera_1, Canvas_1, CanvasElmWithEventBus_1, CollisionSystem_1, EventBus_2, HTMLOverlay_1, Keyboard_1, Mouse_1, World;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (Canvas_1_1) {
                Canvas_1 = Canvas_1_1;
            },
            function (CanvasElmWithEventBus_1_1) {
                CanvasElmWithEventBus_1 = CanvasElmWithEventBus_1_1;
            },
            function (CollisionSystem_1_1) {
                CollisionSystem_1 = CollisionSystem_1_1;
            },
            function (EventBus_2_1) {
                EventBus_2 = EventBus_2_1;
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
                    this.eventBus = new EventBus_2.EventBus();
                    this.keyboard = new Keyboard_1.Keyboard();
                    this.mouse = new Mouse_1.Mouse(this.eventBus);
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
                    if (elm instanceof CanvasElmWithEventBus_1.CanvasElmWithEventBus) {
                        elm.eventBus._attach(this.eventBus);
                    }
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
            exports_15("World", World);
        }
    };
});
System.register("engine/canvasElm/CanvasElm", [], function (exports_16, context_16) {
    "use strict";
    var CanvasElm;
    var __moduleName = context_16 && context_16.id;
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
            exports_16("CanvasElm", CanvasElm);
        }
    };
});
System.register("engine/util/MovingRectangle", ["engine/util/Rectangle"], function (exports_17, context_17) {
    "use strict";
    var Rectangle_2, MovingRectangle;
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (Rectangle_2_1) {
                Rectangle_2 = Rectangle_2_1;
            }
        ],
        execute: function () {
            MovingRectangle = class MovingRectangle extends Rectangle_2.Rectangle {
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
            exports_17("MovingRectangle", MovingRectangle);
        }
    };
});
System.register("entities/Entity", ["engine/canvasElm/CanvasElm", "engine/collision/Hitbox", "engine/util/Rectangle", "entities/collisions"], function (exports_18, context_18) {
    "use strict";
    var CanvasElm_2, Hitbox_1, Rectangle_3, collisions_1, Entity;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (CanvasElm_2_1) {
                CanvasElm_2 = CanvasElm_2_1;
            },
            function (Hitbox_1_1) {
                Hitbox_1 = Hitbox_1_1;
            },
            function (Rectangle_3_1) {
                Rectangle_3 = Rectangle_3_1;
            },
            function (collisions_1_1) {
                collisions_1 = collisions_1_1;
            }
        ],
        execute: function () {
            Entity = class Entity extends CanvasElm_2.CanvasElm {
                constructor() {
                    super(...arguments);
                    this.rect = new Rectangle_3.Rectangle(0, 0, 24, 24);
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
            exports_18("Entity", Entity);
        }
    };
});
System.register("engine/PrerenderCanvas", [], function (exports_19, context_19) {
    "use strict";
    var PrerenderCanvas;
    var __moduleName = context_19 && context_19.id;
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
            exports_19("PrerenderCanvas", PrerenderCanvas);
        }
    };
});
System.register("resources/resourceFetcher", [], function (exports_20, context_20) {
    "use strict";
    var ResourceFetcher, resourceFetcher;
    var __moduleName = context_20 && context_20.id;
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
            exports_20("resourceFetcher", resourceFetcher = new ResourceFetcher());
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
System.register("resources/TileMapFile", [], function (exports_21, context_21) {
    "use strict";
    var TileMapFile, DataViewWalker;
    var __moduleName = context_21 && context_21.id;
    function isTileMapJointExtention(joint) {
        // @ts-expect-error
        return joint.toId !== undefined;
    }
    exports_21("isTileMapJointExtention", isTileMapJointExtention);
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
            exports_21("TileMapFile", TileMapFile);
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
System.register("entities/TileMap", ["engine/PrerenderCanvas", "engine/util/removeElmFromArray", "resources/resourceFetcher", "resources/TileMapFile"], function (exports_22, context_22) {
    "use strict";
    var PrerenderCanvas_1, removeElmFromArray_3, resourceFetcher_1, TileMapFile_1, TileMap, EventHandler;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [
            function (PrerenderCanvas_1_1) {
                PrerenderCanvas_1 = PrerenderCanvas_1_1;
            },
            function (removeElmFromArray_3_1) {
                removeElmFromArray_3 = removeElmFromArray_3_1;
            },
            function (resourceFetcher_1_1) {
                resourceFetcher_1 = resourceFetcher_1_1;
            },
            function (TileMapFile_1_1) {
                TileMapFile_1 = TileMapFile_1_1;
            }
        ],
        execute: function () {
            TileMap = class TileMap {
                constructor(tileMapFile) {
                    this.onTileEdit = new EventHandler();
                    this.onJointEdit = new EventHandler();
                    this.onMajorEdit = new EventHandler();
                    this.textures = [];
                    if (tileMapFile instanceof TileMapFile_1.TileMapFile) {
                        this.file = tileMapFile;
                    }
                    else {
                        this.file = TileMapFile_1.TileMapFile.fromBuffer(tileMapFile);
                    }
                    this.width = this.file.width;
                    this.height = this.file.height;
                    this.map = [];
                    for (let y = 0; y < this.file.height; y++) {
                        const row = [];
                        for (let x = 0; x < this.file.width; x++) {
                            row[x] = this.file.mapData[y * this.file.width + x];
                        }
                        this.map[y] = row;
                    }
                    this.blockTypes = this.file.jsonData.blockTypes || [];
                    this.joints = this.file.jsonData.joints || [];
                }
                getBlockTexture(xIndex, yIndex) {
                    return this.textures[this.map[yIndex][xIndex]];
                }
                getBlockColor(xIndex, yIndex) {
                    return this.blockTypes[this.map[yIndex][xIndex]].color;
                }
                isSolid(xIndex, yIndex) {
                    return xIndex < this.width && xIndex >= 0 &&
                        yIndex < this.height && yIndex >= 0 &&
                        this.blockTypes[this.map[yIndex][xIndex]].solid;
                }
                setBlockByIndex(xIndex, yIndex, block) {
                    if (!this.map[yIndex] ||
                        this.map[yIndex].length <= xIndex ||
                        this.map[yIndex][xIndex] === block) {
                        return;
                    }
                    this.map[yIndex][xIndex] = block;
                    this.onTileEdit.dispatch([xIndex, yIndex]);
                }
                getJoints() {
                    return this.file.jsonData.joints || [];
                }
                removeJoint(joint) {
                    removeElmFromArray_3.removeElmFromArray(joint, this.joints);
                    this.onJointEdit.dispatch();
                }
                addJoint(joint) {
                    this.joints.push(joint);
                    this.onJointEdit.dispatch();
                }
                getJointById(id) {
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
                addBlockType(blockType) {
                    this.blockTypes.push(blockType);
                    this._loadTextures();
                }
                resizeMap(newWidth, newHeight) {
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
                    this.onMajorEdit.dispatch();
                }
                exportToFile() {
                    const width = this.map[0].length;
                    const height = this.map.length;
                    const file = TileMapFile_1.TileMapFile.create(width, height);
                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            file.mapData[y * width + x] = this.map[y][x];
                        }
                    }
                    file.jsonData = {
                        blockTypes: this.blockTypes,
                        joints: this.joints
                    };
                    return file;
                }
                async _loadTextures() {
                    const proms = [];
                    for (let i = 0; i < this.blockTypes.length; i++) {
                        const blockType = this.blockTypes[i];
                        if (!blockType.texture) {
                            this.textures[i] = null;
                            continue;
                        }
                        if (Array.isArray(blockType.texture)) {
                            const layerProms = [];
                            for (const layerTexture of blockType.texture) {
                                layerProms.push(resourceFetcher_1.resourceFetcher.fetchImg("assets/img/tile/" + layerTexture + ".png"));
                            }
                            proms.push(Promise.all(layerProms).then(imgs => {
                                const canvas = new PrerenderCanvas_1.PrerenderCanvas(imgs[0].naturalWidth, imgs[1].naturalHeight);
                                for (const img of imgs) {
                                    canvas.X.drawImage(img, 0, 0);
                                }
                                this.textures[i] = canvas;
                            }));
                        }
                        else {
                            proms.push(resourceFetcher_1.resourceFetcher.fetchImg("assets/img/tile/" + blockType.texture + ".png")
                                .then(img => this.textures[i] = img));
                        }
                    }
                    await Promise.all(proms);
                }
            };
            exports_22("TileMap", TileMap);
            EventHandler = class EventHandler {
                constructor() {
                    this.handlers = [];
                }
                addHandler(handler) {
                    this.handlers.push(handler);
                }
                removeHandler(handler) {
                    const index = this.handlers.indexOf(handler);
                    if (index < 0) {
                        throw new Error("Can't remove handler that doesn't exist");
                    }
                    this.handlers.splice(index, 1);
                }
                dispatch(data) {
                    for (const handler of this.handlers) {
                        handler(data);
                    }
                }
            };
        }
    };
});
System.register("entities/TileMapEntity", ["engine/PrerenderCanvas", "engine/util/Rectangle", "entities/collisions", "entities/Entity"], function (exports_23, context_23) {
    "use strict";
    var PrerenderCanvas_2, Rectangle_4, collisions_2, Entity_1, TileMapEntity;
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [
            function (PrerenderCanvas_2_1) {
                PrerenderCanvas_2 = PrerenderCanvas_2_1;
            },
            function (Rectangle_4_1) {
                Rectangle_4 = Rectangle_4_1;
            },
            function (collisions_2_1) {
                collisions_2 = collisions_2_1;
            },
            function (Entity_1_1) {
                Entity_1 = Entity_1_1;
            }
        ],
        execute: function () {
            TileMapEntity = class TileMapEntity extends Entity_1.Entity {
                constructor(tileMap) {
                    super();
                    this.collisionType = collisions_2.collisions.types.map;
                    this.tileSize = TileMapEntity.tileSize;
                    this.tileTextureSize = 12;
                    this.data = tileMap;
                    this.prerender = new PrerenderCanvas_2.PrerenderCanvas(this.rect.width, this.rect.height);
                    this.data.onTileEdit.addHandler(pos => this.updatePrerenderTile(pos[0], pos[1]));
                    this.data.onMajorEdit.addHandler(() => this.updatePrerender());
                    this.data._loadTextures().then(() => this.updatePrerender());
                }
                setWorld(world) {
                    super.setWorld(world);
                }
                draw() {
                    this.world.canvas.X.imageSmoothingEnabled = false;
                    this.prerender.drawToContext(this.world.canvas.X, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
                }
                updatePrerender() {
                    this.rect.width = this.data.width * this.tileSize;
                    this.rect.height = this.data.height * this.tileSize;
                    this.prerender.resize(this.data.width * this.tileTextureSize, this.data.height * this.tileTextureSize);
                    this.prerender.clear();
                    const X = this.prerender.X;
                    X.imageSmoothingEnabled = false;
                    for (let y = 0; y < this.data.height; y++) {
                        for (let x = 0; x < this.data.width; x++) {
                            this.updatePrerenderTile(x, y);
                        }
                    }
                }
                updatePrerenderTile(xIndex, yIndex) {
                    const X = this.prerender.X;
                    const texture = this.data.getBlockTexture(xIndex, yIndex);
                    if (texture instanceof PrerenderCanvas_2.PrerenderCanvas) {
                        texture.drawToContext(X, xIndex * this.tileTextureSize, yIndex * this.tileTextureSize);
                    }
                    else if (texture) {
                        X.drawImage(texture, xIndex * this.tileTextureSize, yIndex * this.tileTextureSize);
                    }
                    else {
                        X.clearRect(xIndex * this.tileTextureSize, yIndex * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
                        X.fillStyle = this.data.getBlockColor(xIndex, yIndex);
                        X.fillRect(xIndex * this.tileTextureSize, yIndex * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
                    }
                }
                setBlock(x, y, block) {
                    const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
                    const yIndex = Math.floor((y - this.rect.y) / this.tileSize);
                    this.data.setBlockByIndex(xIndex, yIndex, block);
                }
                getCollisionTiles(x, y) {
                    const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
                    const yIndex = Math.floor((y - this.rect.y) / this.tileSize);
                    const rects = [];
                    let capturedTopLeft = false;
                    let capturedTopRight = false;
                    let capturedBottomLeft = false;
                    let capturedBottomRight = false;
                    if (this.data.isSolid(xIndex, yIndex)) {
                        rects.push(this.rectFromIndexes(xIndex, yIndex));
                    }
                    if (this.data.isSolid(xIndex - 1, yIndex)) {
                        let rect = this.rectFromIndexes(xIndex - 1, yIndex);
                        if (this.data.isSolid(xIndex - 1, yIndex - 1)) {
                            rect.y -= this.tileSize;
                            rect.height += this.tileSize;
                            capturedTopLeft = true;
                        }
                        if (this.data.isSolid(xIndex - 1, yIndex + 1)) {
                            rect.height += this.tileSize;
                            capturedBottomLeft = true;
                        }
                        rects.push(rect);
                    }
                    if (this.data.isSolid(xIndex + 1, yIndex)) {
                        let rect = this.rectFromIndexes(xIndex + 1, yIndex);
                        if (this.data.isSolid(xIndex + 1, yIndex - 1)) {
                            rect.y -= this.tileSize;
                            rect.height += this.tileSize;
                            capturedTopRight = true;
                        }
                        if (this.data.isSolid(xIndex + 1, yIndex + 1)) {
                            rect.height += this.tileSize;
                            capturedBottomRight = true;
                        }
                        rects.push(rect);
                    }
                    if (this.data.isSolid(xIndex, yIndex + 1)) {
                        let rect = this.rectFromIndexes(xIndex, yIndex + 1);
                        if (this.data.isSolid(xIndex - 1, yIndex + 1)) {
                            rect.x -= this.tileSize;
                            rect.width += this.tileSize;
                            capturedBottomLeft = true;
                        }
                        if (this.data.isSolid(xIndex + 1, yIndex + 1)) {
                            rect.width += this.tileSize;
                            capturedBottomRight = true;
                        }
                        rects.push(rect);
                    }
                    if (this.data.isSolid(xIndex, yIndex - 1)) {
                        let rect = this.rectFromIndexes(xIndex, yIndex - 1);
                        if (this.data.isSolid(xIndex - 1, yIndex - 1)) {
                            rect.x -= this.tileSize;
                            rect.width += this.tileSize;
                            capturedTopLeft = true;
                        }
                        if (this.data.isSolid(xIndex + 1, yIndex - 1)) {
                            rect.width += this.tileSize;
                            capturedTopRight = true;
                        }
                        rects.push(rect);
                    }
                    if (!capturedBottomLeft && this.data.isSolid(xIndex - 1, yIndex + 1)) {
                        rects.push(this.rectFromIndexes(xIndex - 1, yIndex + 1));
                    }
                    if (!capturedBottomRight && this.data.isSolid(xIndex + 1, yIndex + 1)) {
                        rects.push(this.rectFromIndexes(xIndex + 1, yIndex + 1));
                    }
                    if (!capturedTopLeft && this.data.isSolid(xIndex - 1, yIndex - 1)) {
                        rects.push(this.rectFromIndexes(xIndex - 1, yIndex - 1));
                    }
                    if (!capturedTopRight && this.data.isSolid(xIndex + 1, yIndex - 1)) {
                        rects.push(this.rectFromIndexes(xIndex + 1, yIndex - 1));
                    }
                    return rects;
                }
                rectFromIndexes(xIndex, yIndex) {
                    return new Rectangle_4.Rectangle(xIndex * this.tileSize + this.rect.x, yIndex * this.tileSize + this.rect.y, this.tileSize, this.tileSize);
                }
            };
            exports_23("TileMapEntity", TileMapEntity);
            TileMapEntity.tileSize = 48;
        }
    };
});
System.register("entities/collisions", ["engine/collision/isRectanglesColliding", "engine/util/MovingRectangle"], function (exports_24, context_24) {
    "use strict";
    var isRectanglesColliding_2, MovingRectangle_1, collisions;
    var __moduleName = context_24 && context_24.id;
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
    exports_24("registerCollisions", registerCollisions);
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
            exports_24("collisions", collisions = {
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
System.register("engine/canvasElm/ParentCanvasElm", ["engine/util/removeElmFromArray", "engine/canvasElm/CanvasElmWithEventBus"], function (exports_25, context_25) {
    "use strict";
    var removeElmFromArray_4, CanvasElmWithEventBus_2, ParentCanvasElm;
    var __moduleName = context_25 && context_25.id;
    return {
        setters: [
            function (removeElmFromArray_4_1) {
                removeElmFromArray_4 = removeElmFromArray_4_1;
            },
            function (CanvasElmWithEventBus_2_1) {
                CanvasElmWithEventBus_2 = CanvasElmWithEventBus_2_1;
            }
        ],
        execute: function () {
            ParentCanvasElm = class ParentCanvasElm extends CanvasElmWithEventBus_2.CanvasElmWithEventBus {
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
                    super.dispose();
                    for (const child of this.children) {
                        child.dispose();
                    }
                }
                addChild(child) {
                    this.children.push(child);
                    if (this.world) {
                        child.setWorld(this.world);
                    }
                    if (child instanceof CanvasElmWithEventBus_2.CanvasElmWithEventBus) {
                        child.eventBus._attach(this.eventBus);
                    }
                }
                removeChild(child) {
                    removeElmFromArray_4.removeElmFromArray(child, this.children);
                    child.dispose();
                }
            };
            exports_25("ParentCanvasElm", ParentCanvasElm);
        }
    };
});
System.register("resources/dialogFetcher", ["resources/resourceFetcher"], function (exports_26, context_26) {
    "use strict";
    var resourceFetcher_2, DialogFetcher, dialogFetcher;
    var __moduleName = context_26 && context_26.id;
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
            exports_26("dialogFetcher", dialogFetcher = new DialogFetcher());
        }
    };
});
System.register("settings", [], function (exports_27, context_27) {
    "use strict";
    var settings;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [],
        execute: function () {
            exports_27("settings", settings = {
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
System.register("ui/NPCDialog", ["engine/canvasElm/CanvasElm", "engine/elements", "settings"], function (exports_28, context_28) {
    "use strict";
    var CanvasElm_3, elements_2, settings_1, NPCDialog;
    var __moduleName = context_28 && context_28.id;
    return {
        setters: [
            function (CanvasElm_3_1) {
                CanvasElm_3 = CanvasElm_3_1;
            },
            function (elements_2_1) {
                elements_2 = elements_2_1;
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
                    this.closed = false;
                    this.elm = new elements_2.Elm().class("NPCDialog");
                    this.index = 0;
                    this.charIndex = 0;
                    this.secondPerChar = 0.03;
                    this.timeToNext = 0;
                    this.advanceDialogHandler = this.advanceDialogHandler.bind(this);
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.htmlOverlay.elm.append(this.elm);
                    world.keyboard.addKeydownHandler(settings_1.settings.keybindings.select, this.advanceDialogHandler);
                }
                draw() { }
                tick() {
                    if (this.charIndex >= this.dialog[this.index].length) {
                        return;
                    }
                    this.timeToNext -= this.world.timeElapsed;
                    while (this.timeToNext < 0) {
                        this.elm.append(this.dialog[this.index][this.charIndex]);
                        this.charIndex++;
                        this.timeToNext += this.secondPerChar;
                    }
                }
                advanceDialogHandler() {
                    this.index++;
                    if (this.dialog[this.index] === undefined) {
                        this.closed = true;
                        this.world.removeElm(this);
                    }
                    else {
                        this.elm.clear();
                        this.charIndex = 0;
                    }
                }
                dispose() {
                    this.world.keyboard.removeKeydownHandler(settings_1.settings.keybindings.select, this.advanceDialogHandler);
                    this.elm.remove();
                    super.dispose();
                }
            };
            exports_28("NPCDialog", NPCDialog);
        }
    };
});
System.register("entities/NPC", ["entities/Entity"], function (exports_29, context_29) {
    "use strict";
    var Entity_2, NPC;
    var __moduleName = context_29 && context_29.id;
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
            exports_29("NPC", NPC);
        }
    };
});
System.register("entities/Player", ["engine/util/MovingRectangle", "settings", "entities/collisions", "entities/Entity"], function (exports_30, context_30) {
    "use strict";
    var MovingRectangle_2, settings_2, collisions_3, Entity_3, Player;
    var __moduleName = context_30 && context_30.id;
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
                    this.rect = new MovingRectangle_2.MovingRectangle(296, 200, 24, 24);
                    this.speed = 300;
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
            exports_30("Player", Player);
        }
    };
});
System.register("entities/NPCWithDialog", ["engine/util/Rectangle", "resources/dialogFetcher", "ui/NPCDialog", "entities/NPC", "entities/Player"], function (exports_31, context_31) {
    "use strict";
    var Rectangle_5, dialogFetcher_1, NPCDialog_1, NPC_1, Player_1, NPCWithDialog;
    var __moduleName = context_31 && context_31.id;
    return {
        setters: [
            function (Rectangle_5_1) {
                Rectangle_5 = Rectangle_5_1;
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
                    this.loadingDialog = false;
                }
                onCollision(other) {
                    if (!(other instanceof Player_1.Player)) {
                        return;
                    }
                    if (this.loadingDialog) {
                        return;
                    }
                    if (this.npcDialog && !this.npcDialog.closed) {
                        return;
                    }
                    this.loadingDialog = true;
                    dialogFetcher_1.dialogFetcher.fetch("testDialog").then(dialog => {
                        this.npcDialog = new NPCDialog_1.NPCDialog(dialog, new Rectangle_5.Rectangle(this.rect.x, this.rect.y, 500, 300));
                        this.world.addElm(this.npcDialog);
                        this.loadingDialog = false;
                    });
                }
                dispose() {
                    super.dispose();
                    if (this.npcDialog && !this.npcDialog.closed) {
                        this.world.removeElm(this.npcDialog);
                    }
                }
            };
            exports_31("NPCWithDialog", NPCWithDialog);
        }
    };
});
System.register("resources/tileMapFetcher", ["entities/TileMap", "resources/resourceFetcher"], function (exports_32, context_32) {
    "use strict";
    var TileMap_1, resourceFetcher_3, TileMapFetcher, tileMapFetcher;
    var __moduleName = context_32 && context_32.id;
    return {
        setters: [
            function (TileMap_1_1) {
                TileMap_1 = TileMap_1_1;
            },
            function (resourceFetcher_3_1) {
                resourceFetcher_3 = resourceFetcher_3_1;
            }
        ],
        execute: function () {
            TileMapFetcher = class TileMapFetcher {
                async fetch(url) {
                    const data = await resourceFetcher_3.resourceFetcher.fetchRaw("assets/map/" + url + ".tmap");
                    return new TileMap_1.TileMap(data);
                }
            };
            exports_32("tileMapFetcher", tileMapFetcher = new TileMapFetcher());
        }
    };
});
System.register("entities/ParentTileMap", ["engine/collision/isRectanglesColliding", "engine/canvasElm/ParentCanvasElm", "engine/util/Rectangle", "resources/TileMapFile", "entities/TileMapEntity", "resources/tileMapFetcher"], function (exports_33, context_33) {
    "use strict";
    var isRectanglesColliding_3, ParentCanvasElm_1, Rectangle_6, TileMapFile_2, TileMapEntity_1, tileMapFetcher_1, ParentTileMap;
    var __moduleName = context_33 && context_33.id;
    return {
        setters: [
            function (isRectanglesColliding_3_1) {
                isRectanglesColliding_3 = isRectanglesColliding_3_1;
            },
            function (ParentCanvasElm_1_1) {
                ParentCanvasElm_1 = ParentCanvasElm_1_1;
            },
            function (Rectangle_6_1) {
                Rectangle_6 = Rectangle_6_1;
            },
            function (TileMapFile_2_1) {
                TileMapFile_2 = TileMapFile_2_1;
            },
            function (TileMapEntity_1_1) {
                TileMapEntity_1 = TileMapEntity_1_1;
            },
            function (tileMapFetcher_1_1) {
                tileMapFetcher_1 = tileMapFetcher_1_1;
            }
        ],
        execute: function () {
            ParentTileMap = class ParentTileMap extends ParentCanvasElm_1.ParentCanvasElm {
                constructor(mapFile, view) {
                    super();
                    this.view = view;
                    this.activeMapEntities = [];
                    this.maps = [];
                    this.addTileMap(mapFile, 0, 0);
                    console.log(this);
                }
                tick() {
                    super.tick();
                    for (const map of this.maps) {
                        if (map.active) {
                            continue;
                        }
                        if (isRectanglesColliding_3.isRectanglesColliding(this.view, map.rect)) {
                            const entity = new TileMapEntity_1.TileMapEntity(map.map);
                            entity.rect.x = map.rect.x;
                            entity.rect.y = map.rect.y;
                            this.activeMapEntities.push(entity);
                            this.addChild(entity);
                            map.active = true;
                        }
                    }
                }
                addTileMap(tileMap, offsetX, offsetY) {
                    const joints = tileMap.getJoints();
                    this.maps.push({
                        map: tileMap,
                        rect: new Rectangle_6.Rectangle(offsetX, offsetY, tileMap.width * TileMapEntity_1.TileMapEntity.tileSize, tileMap.height * TileMapEntity_1.TileMapEntity.tileSize),
                        active: false
                    });
                    for (const joint of joints) {
                        if (!TileMapFile_2.isTileMapJointExtention(joint)) {
                            continue;
                        }
                        tileMapFetcher_1.tileMapFetcher.fetch(joint.toMap)
                            .then(tileMap => {
                            const newJoint = tileMap.getJointById(joint.toId);
                            if (!newJoint) {
                                throw new Error("Failed to join joints -- could not find target joint.");
                            }
                            this.addTileMap(tileMap, (joint.x - newJoint.x) * TileMapEntity_1.TileMapEntity.tileSize + offsetX, (joint.y - newJoint.y) * TileMapEntity_1.TileMapEntity.tileSize + offsetY);
                        });
                    }
                }
            };
            exports_33("ParentTileMap", ParentTileMap);
        }
    };
});
System.register("view/GameView", ["engine/canvasElm/ParentCanvasElm", "entities/NPCWithDialog", "entities/ParentTileMap", "entities/Player", "resources/tileMapFetcher"], function (exports_34, context_34) {
    "use strict";
    var ParentCanvasElm_2, NPCWithDialog_1, ParentTileMap_1, Player_2, tileMapFetcher_2, GameView;
    var __moduleName = context_34 && context_34.id;
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
            function (tileMapFetcher_2_1) {
                tileMapFetcher_2 = tileMapFetcher_2_1;
            }
        ],
        execute: function () {
            GameView = class GameView extends ParentCanvasElm_2.ParentCanvasElm {
                constructor() {
                    super();
                    this.player = new Player_2.Player();
                    tileMapFetcher_2.tileMapFetcher.fetch("cave")
                        .then(tileMap => {
                        this.addChild(new ParentTileMap_1.ParentTileMap(tileMap, this.world.camera.rect));
                        this.addChild(this.player);
                        this.addChild(new NPCWithDialog_1.NPCWithDialog(3750, 3750));
                        this.addChild(new NPCWithDialog_1.NPCWithDialog(100, -200));
                    });
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.camera.follow(this.player.rect);
                }
            };
            exports_34("GameView", GameView);
        }
    };
});
System.register("entities/GhostPlayer", ["entities/collisions", "entities/Player"], function (exports_35, context_35) {
    "use strict";
    var collisions_4, Player_3, GhostPlayer;
    var __moduleName = context_35 && context_35.id;
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
                    this.actualSpeed = 1000;
                }
                tick() {
                    this.speed = this.actualSpeed / this.world.camera.scale;
                    super.tick();
                }
            };
            exports_35("GhostPlayer", GhostPlayer);
        }
    };
});
System.register("view/mapEditor/MapEditorOverlay", ["engine/elements"], function (exports_36, context_36) {
    "use strict";
    var elements_3, MapEditorOverlay, DialogBoxForm;
    var __moduleName = context_36 && context_36.id;
    return {
        setters: [
            function (elements_3_1) {
                elements_3 = elements_3_1;
            }
        ],
        execute: function () {
            MapEditorOverlay = class MapEditorOverlay extends elements_3.Component {
                constructor() {
                    super("MapEditorOverlay");
                    this.selectedBlock = 1;
                    this.fillMode = false;
                    this.blockTypeElms = [];
                    this.blockTypesElm = new elements_3.Elm().class("blockTypes")
                        .appendTo(this.elm);
                    this.fillModeToggle = new elements_3.Elm().class("fillModeToggle", "button")
                        .append("Fill mode")
                        .on("click", () => {
                        this.fillMode = !this.fillMode;
                        if (this.fillMode) {
                            this.fillModeToggle.class("on");
                        }
                        else {
                            this.fillModeToggle.removeClass("on");
                        }
                    })
                        .appendTo(this.elm);
                    this.canvasSizeElm = new elements_3.Elm().class("canvasSize", "button")
                        .on("click", () => this.openChangeMapSizeDialog())
                        .appendTo(this.elm);
                }
                setTileMap(tileMap) {
                    this.tileMap = tileMap;
                    this.setBlockTypes(tileMap.getBlockTypes());
                    this.setCanvasSize(tileMap.width, tileMap.height);
                }
                editJoint(joint) {
                    DialogBoxForm.createFilledForm(this.elm, joint)
                        .then(updated => {
                        if (!this.tileMap) {
                            return;
                        }
                        this.tileMap.removeJoint(joint);
                        this.tileMap.addJoint(updated);
                    });
                }
                setBlockTypes(blockTypes) {
                    this.blockTypesElm.clear();
                    for (let i = 0; i < blockTypes.length; i++) {
                        const blockType = blockTypes[i];
                        let elm;
                        if (blockType.texture) {
                            if (Array.isArray(blockType.texture)) {
                                elm = new elements_3.Elm("div").class("layered");
                                for (const layer of blockType.texture) {
                                    new elements_3.Elm("img").attribute("src", "assets/img/tile/" + layer + ".png").class("layer").appendTo(elm);
                                }
                            }
                            else {
                                elm = new elements_3.Elm("img").attribute("src", "assets/img/tile/" + blockType.texture + ".png");
                            }
                        }
                        else {
                            elm = new elements_3.Elm("div");
                        }
                        elm.class("blockType").attribute("style", "background-color: " + blockType.color);
                        elm.on("click", () => {
                            this.selectBlock(i);
                        });
                        this.blockTypesElm.append(elm);
                        this.blockTypeElms[i] = elm;
                    }
                    this.blockTypesElm.append(new elements_3.Elm("div").append("+").class("blockType", "addBlockType").on("click", () => {
                        DialogBoxForm.createEmptyForm(this.elm, {
                            color: "string",
                            texture: "string",
                            solid: "boolean"
                        }).then((response) => {
                            var _a;
                            if (!this.tileMap) {
                                return;
                            }
                            if ((_a = response.texture) === null || _a === void 0 ? void 0 : _a.includes("+")) {
                                response.texture = response.texture.split("+");
                            }
                            this.tileMap.addBlockType(response);
                            this.setBlockTypes(this.tileMap.getBlockTypes());
                        });
                    }));
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
                    this.tileMap.resizeMap(newWidth, newHeight);
                    this.setCanvasSize(newWidth, newHeight);
                }
            };
            exports_36("MapEditorOverlay", MapEditorOverlay);
            DialogBoxForm = class DialogBoxForm extends elements_3.Component {
                constructor() {
                    super("dialogBox");
                    this.inputsElm = new elements_3.Elm();
                    this.inputsMap = new Map();
                    this.elm.class("dialogBox", "form");
                    this.elm.append(this.inputsElm, new elements_3.Elm().append(new elements_3.Elm("button").append("Cancel")
                        .on("click", () => {
                        this.cancel();
                    }), new elements_3.Elm("button").append("Submit")
                        .on("click", () => {
                        this.trySubmit();
                    })));
                    this.reponsePromise = new Promise((res, rej) => {
                        this.resPromise = res;
                        this.rejPromise = rej;
                    });
                }
                static async createEmptyForm(parent, fields) {
                    const keys = Object.keys(fields);
                    const dialogBoxForm = new DialogBoxForm();
                    for (const key of keys) {
                        dialogBoxForm.addInput(key, {
                            type: DialogBoxForm.typeToInputType[fields[key]]
                        });
                    }
                    dialogBoxForm.appendTo(parent);
                    return dialogBoxForm.reponsePromise;
                }
                static async createFilledForm(parent, fields) {
                    const keys = Object.keys(fields);
                    const dialogBoxForm = new DialogBoxForm();
                    for (const key of keys) {
                        dialogBoxForm.addInput(key, {
                            type: typeof fields[key],
                            default: fields[key]
                        });
                    }
                    dialogBoxForm.appendTo(parent);
                    return dialogBoxForm.reponsePromise;
                }
                addInput(key, options) {
                    const input = new elements_3.InputElm().setType(options.type);
                    if (options.default !== undefined) {
                        input.setValue(options.default);
                    }
                    input.on("keydown", e => {
                        if (e.code === "Enter") {
                            this.trySubmit();
                        }
                        else if (e.code === "Escape") {
                            this.cancel();
                        }
                    });
                    this.inputsElm.append(new elements_3.Elm("label").class("field").append(key, ": ", input));
                    this.inputsMap.set(key, [input, options]);
                }
                cancel() {
                    this.elm.remove();
                    this.rejPromise("Canceled by user");
                }
                trySubmit() {
                    const response = this.getResponse();
                    if (!response) {
                        return;
                    }
                    this.resPromise(response);
                    this.elm.remove();
                }
                getResponse() {
                    const response = {};
                    for (const [key, [input, options]] of this.inputsMap) {
                        if (options.type === "number") {
                            const val = parseFloat(input.getValue());
                            if (isNaN(val)) {
                                return;
                            }
                            response[key] = val;
                        }
                        else if (options.type === "text") {
                            const val = input.getValue();
                            if (!val) {
                                return;
                            }
                            response[key] = val;
                        }
                        else if (options.type === "checkbox") {
                            response[key] = input.getValue();
                        }
                        else {
                            console.warn("Unknown type", options.type);
                        }
                    }
                    return response;
                }
            };
            DialogBoxForm.typeToInputType = {
                number: "number",
                string: "text",
                boolean: "checkbox"
            };
        }
    };
});
System.register("view/mapEditor/MapEditorEntityJointLayer", ["engine/canvasElm/CanvasElmWithEventBus"], function (exports_37, context_37) {
    "use strict";
    var CanvasElmWithEventBus_3, MapEditorEntityJointLayer;
    var __moduleName = context_37 && context_37.id;
    return {
        setters: [
            function (CanvasElmWithEventBus_3_1) {
                CanvasElmWithEventBus_3 = CanvasElmWithEventBus_3_1;
            }
        ],
        execute: function () {
            MapEditorEntityJointLayer = class MapEditorEntityJointLayer extends CanvasElmWithEventBus_3.CanvasElmWithEventBus {
                constructor(tileMap, overlay) {
                    super();
                    this.tileMap = tileMap;
                    this.overlay = overlay;
                    this.joints = [];
                    this.eventBus.subscribe("mousedown", () => this.mousedownHandler());
                    this.updateJointRecords();
                    this.tileMap.data.onJointEdit.addHandler(() => this.updateJointRecords());
                }
                mousedownHandler() {
                    const jointRadius = this.tileMap.tileSize / 4;
                    for (const joint of this.joints) {
                        const cursorX = this.world.camera.clientXToWorld(this.world.mouse.x);
                        const cursorY = this.world.camera.clientYToWorld(this.world.mouse.y);
                        const dx = cursorX - joint.x;
                        const dy = cursorY - joint.y;
                        if (dx * dx + dy * dy < jointRadius * jointRadius) {
                            if (this.world.mouse.rightDown) {
                                this.tileMap.data.removeJoint(joint.joint);
                            }
                            else {
                                this.overlay.editJoint(joint.joint);
                            }
                            this.eventBus.stopPropagation();
                        }
                    }
                }
                draw() {
                    const X = this.world.canvas.X;
                    const jointRadius = this.tileMap.tileSize / 4;
                    for (const joint of this.joints) {
                        X.fillStyle = "#00ff0088";
                        X.beginPath();
                        X.arc(joint.x, joint.y, jointRadius, 0, Math.PI * 2);
                        X.fill();
                    }
                }
                updateJointRecords() {
                    this.joints.length = 0;
                    for (const joint of this.tileMap.data.getJoints()) {
                        this.joints.push({
                            joint: joint,
                            x: this.tileMap.tileSize * (joint.x + 0.5),
                            y: this.tileMap.tileSize * (joint.y + 0.5)
                        });
                    }
                }
            };
            exports_37("MapEditorEntityJointLayer", MapEditorEntityJointLayer);
        }
    };
});
System.register("view/mapEditor/MapEditorMapLayer", ["engine/canvasElm/ParentCanvasElm"], function (exports_38, context_38) {
    "use strict";
    var ParentCanvasElm_3, MapEditorMapLayer;
    var __moduleName = context_38 && context_38.id;
    return {
        setters: [
            function (ParentCanvasElm_3_1) {
                ParentCanvasElm_3 = ParentCanvasElm_3_1;
            }
        ],
        execute: function () {
            MapEditorMapLayer = class MapEditorMapLayer extends ParentCanvasElm_3.ParentCanvasElm {
                constructor(tileMap, overlay) {
                    super();
                    this.tileMap = tileMap;
                    this.overlay = overlay;
                    this.leftDown = false;
                    this.rightDown = false;
                    this.fillMode = false;
                    this.fillModeCornerX = 0;
                    this.fillModeCornerY = 0;
                    this.addChild(tileMap);
                    this.eventBus.subscribe("mousedown", () => this.updateMouse());
                    this.eventBus.subscribe("mouseup", () => this.updateMouse());
                }
                updateMouse() {
                    this.leftDown = this.world.mouse.leftDown;
                    this.rightDown = this.world.mouse.rightDown;
                    this.fillMode = this.overlay.fillMode;
                    if (this.fillMode) {
                        this.fillModeCornerX = this.getRelMouseX();
                        this.fillModeCornerY = this.getRelMouseY();
                    }
                }
                tick() {
                    super.tick();
                    const xIndex = this.getRelMouseX();
                    const yIndex = this.getRelMouseY();
                    let selectedBlock;
                    if (this.leftDown) {
                        selectedBlock = this.overlay.selectedBlock;
                    }
                    else if (this.rightDown) {
                        selectedBlock = 0;
                    }
                    else {
                        return;
                    }
                    if (this.fillMode) {
                        const left = Math.min(xIndex, this.fillModeCornerX);
                        const right = Math.max(xIndex, this.fillModeCornerX);
                        const top = Math.min(yIndex, this.fillModeCornerY);
                        const bottom = Math.max(yIndex, this.fillModeCornerY);
                        for (let y = top; y <= bottom; y++) {
                            for (let x = left; x <= right; x++) {
                                this.tileMap.data.setBlockByIndex(x, y, selectedBlock);
                            }
                        }
                    }
                    else {
                        this.tileMap.data.setBlockByIndex(xIndex, yIndex, selectedBlock);
                    }
                }
                draw() {
                    super.draw();
                    const xIndex = this.getRelMouseX();
                    const yIndex = this.getRelMouseY();
                    const X = this.world.canvas.X;
                    X.fillStyle = "#ff0000";
                    X.font = "12px Arial";
                    X.textBaseline = "top";
                    X.fillText("(" + xIndex + ", " + yIndex + ")", xIndex * this.tileMap.tileSize, yIndex * this.tileMap.tileSize);
                }
                getRelMouseX() {
                    return Math.floor(this.world.camera.clientXToWorld(this.world.mouse.x) / this.tileMap.tileSize);
                }
                getRelMouseY() {
                    return Math.floor(this.world.camera.clientYToWorld(this.world.mouse.y) / this.tileMap.tileSize);
                }
            };
            exports_38("MapEditorMapLayer", MapEditorMapLayer);
        }
    };
});
System.register("view/mapEditor/MapEditor", ["engine/canvasElm/ParentCanvasElm", "entities/GhostPlayer", "entities/TileMapEntity", "resources/tileMapFetcher", "settings", "view/mapEditor/MapEditorEntityJointLayer", "view/mapEditor/MapEditorMapLayer", "view/mapEditor/MapEditorOverlay"], function (exports_39, context_39) {
    "use strict";
    var ParentCanvasElm_4, GhostPlayer_1, TileMapEntity_2, tileMapFetcher_3, settings_3, MapEditorEntityJointLayer_1, MapEditorMapLayer_1, MapEditorOverlay_1, MapEditor;
    var __moduleName = context_39 && context_39.id;
    return {
        setters: [
            function (ParentCanvasElm_4_1) {
                ParentCanvasElm_4 = ParentCanvasElm_4_1;
            },
            function (GhostPlayer_1_1) {
                GhostPlayer_1 = GhostPlayer_1_1;
            },
            function (TileMapEntity_2_1) {
                TileMapEntity_2 = TileMapEntity_2_1;
            },
            function (tileMapFetcher_3_1) {
                tileMapFetcher_3 = tileMapFetcher_3_1;
            },
            function (settings_3_1) {
                settings_3 = settings_3_1;
            },
            function (MapEditorEntityJointLayer_1_1) {
                MapEditorEntityJointLayer_1 = MapEditorEntityJointLayer_1_1;
            },
            function (MapEditorMapLayer_1_1) {
                MapEditorMapLayer_1 = MapEditorMapLayer_1_1;
            },
            function (MapEditorOverlay_1_1) {
                MapEditorOverlay_1 = MapEditorOverlay_1_1;
            }
        ],
        execute: function () {
            MapEditor = class MapEditor extends ParentCanvasElm_4.ParentCanvasElm {
                constructor() {
                    super();
                    this.ghostPlayer = new GhostPlayer_1.GhostPlayer();
                    this.overlay = new MapEditorOverlay_1.MapEditorOverlay();
                    tileMapFetcher_3.tileMapFetcher.fetch(prompt("Open map name"))
                        .then(tileMap => {
                        this.tileMap = new TileMapEntity_2.TileMapEntity(tileMap);
                        this.overlay.setTileMap(this.tileMap.data);
                        this.addChild(new MapEditorMapLayer_1.MapEditorMapLayer(this.tileMap, this.overlay));
                        this.addChild(new MapEditorEntityJointLayer_1.MapEditorEntityJointLayer(this.tileMap, this.overlay));
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
                    super.dispose();
                    this.overlay.elm.remove();
                }
                tick() {
                    super.tick();
                    if (this.world.keyboard.isDown(settings_3.settings.keybindings.zoomOut)) {
                        this.world.camera.scale /= 1.02;
                    }
                    else if (this.world.keyboard.isDown(settings_3.settings.keybindings.zoomIn)) {
                        this.world.camera.scale *= 1.02;
                    }
                }
                draw() {
                    super.draw();
                }
                exportMapKeyHandler() {
                    if (!this.tileMap) {
                        return;
                    }
                    const blob = this.tileMap.data.exportToFile().encode();
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
            exports_39("MapEditor", MapEditor);
        }
    };
});
System.register("index", ["engine/World", "entities/collisions", "view/GameView", "view/mapEditor/MapEditor"], function (exports_40, context_40) {
    "use strict";
    var World_1, collisions_5, GameView_1, MapEditor_1, world, currViewElm;
    var __moduleName = context_40 && context_40.id;
    function navigateByHash() {
        if (currViewElm) {
            world.removeElm(currViewElm);
        }
        if (location.hash == "#mapEditor") {
            currViewElm = new MapEditor_1.MapEditor();
        }
        else {
            currViewElm = new GameView_1.GameView();
        }
        world.addElm(currViewElm);
    }
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
            navigateByHash();
            requanf();
            addEventListener("hashchange", function () {
                navigateByHash();
            });
            // @ts-ignore -- debug
            window.world = world;
            history.scrollRestoration = "manual";
        }
    };
});
