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
                }
                resizeToScreen() {
                    const dpr = window.devicePixelRatio || 1;
                    this.canvas.width = this.width = dpr * innerWidth;
                    this.canvas.height = this.height = dpr * innerHeight;
                    this.X.scale(dpr, dpr);
                }
                appendTo(parent) {
                    parent.appendChild(this.canvas);
                }
            };
            exports_1("Canvas", Canvas);
        }
    };
});
System.register("engine/Rectangle", [], function (exports_2, context_2) {
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
System.register("engine/collision/Hitbox", [], function (exports_3, context_3) {
    "use strict";
    var Hitbox;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            Hitbox = class Hitbox {
                constructor(rectangle, elm) {
                    this.rectangle = rectangle;
                    this.elm = elm;
                }
            };
            exports_3("Hitbox", Hitbox);
        }
    };
});
System.register("engine/collision/CollisionReactionMap", [], function (exports_4, context_4) {
    "use strict";
    var CollisionReactionMap;
    var __moduleName = context_4 && context_4.id;
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
            exports_4("CollisionReactionMap", CollisionReactionMap);
        }
    };
});
System.register("engine/collision/isRectanglesColliding", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function isRectanglesColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }
    exports_5("isRectanglesColliding", isRectanglesColliding);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("engine/collision/CollisionSystem", ["engine/collision/CollisionReactionMap", "engine/collision/isRectanglesColliding"], function (exports_6, context_6) {
    "use strict";
    var CollisionReactionMap_1, isRectanglesColliding_1, CollisionSystem;
    var __moduleName = context_6 && context_6.id;
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
            exports_6("CollisionSystem", CollisionSystem);
        }
    };
});
System.register("engine/Keyboard", [], function (exports_7, context_7) {
    "use strict";
    var Keyboard;
    var __moduleName = context_7 && context_7.id;
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
                startListen() {
                    addEventListener("keyup", this.keyupHandler);
                    addEventListener("keydown", this.keydownHandler);
                }
                stopListen() {
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
            exports_7("default", Keyboard);
        }
    };
});
System.register("engine/World", ["engine/Canvas", "engine/collision/CollisionSystem", "engine/Keyboard"], function (exports_8, context_8) {
    "use strict";
    var Canvas_1, CollisionSystem_1, Keyboard_1, World;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (Canvas_1_1) {
                Canvas_1 = Canvas_1_1;
            },
            function (CollisionSystem_1_1) {
                CollisionSystem_1 = CollisionSystem_1_1;
            },
            function (Keyboard_1_1) {
                Keyboard_1 = Keyboard_1_1;
            }
        ],
        execute: function () {
            World = class World {
                constructor() {
                    this.canvas = new Canvas_1.Canvas();
                    this.keyboard = new Keyboard_1.default();
                    this.collisionSystem = new CollisionSystem_1.CollisionSystem();
                    this.elms = [];
                    this.canvas.resizeToScreen();
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
                appendTo(parent) {
                    this.canvas.appendTo(parent);
                }
            };
            exports_8("World", World);
        }
    };
});
System.register("engine/CanvasElm", [], function (exports_9, context_9) {
    "use strict";
    var CanvasElm;
    var __moduleName = context_9 && context_9.id;
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
            exports_9("CanvasElm", CanvasElm);
        }
    };
});
System.register("entities/Entity", ["engine/CanvasElm", "engine/collision/Hitbox", "entities/collisions"], function (exports_10, context_10) {
    "use strict";
    var CanvasElm_1, Hitbox_1, collisions_1, Entity;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (CanvasElm_1_1) {
                CanvasElm_1 = CanvasElm_1_1;
            },
            function (Hitbox_1_1) {
                Hitbox_1 = Hitbox_1_1;
            },
            function (collisions_1_1) {
                collisions_1 = collisions_1_1;
            }
        ],
        execute: function () {
            Entity = class Entity extends CanvasElm_1.CanvasElm {
                constructor() {
                    super(...arguments);
                    this.x = 0;
                    this.y = 0;
                    this.width = 24;
                    this.height = 24;
                    this.collisionType = collisions_1.collisions.types.static;
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.collisionSystem.addHitbox(new Hitbox_1.Hitbox(this, this));
                }
                dispose() {
                    throw new Error("Not implemented");
                }
            };
            exports_10("Entity", Entity);
        }
    };
});
System.register("resources/resourceFetcher", [], function (exports_11, context_11) {
    "use strict";
    var ResourceFetcher, resourceFetcher;
    var __moduleName = context_11 && context_11.id;
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
            exports_11("resourceFetcher", resourceFetcher = new ResourceFetcher());
        }
    };
});
System.register("entities/TileMap", ["engine/Rectangle", "resources/resourceFetcher", "entities/collisions", "entities/Entity"], function (exports_12, context_12) {
    "use strict";
    var Rectangle_1, resourceFetcher_1, collisions_2, Entity_1, TileMap;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (Rectangle_1_1) {
                Rectangle_1 = Rectangle_1_1;
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
                    this.tileSize = 64;
                    resourceFetcher_1.resourceFetcher.fetch("assets/map.txt").then(str => {
                        this.map = str.split("\n");
                        this.height = this.map.length * this.tileSize;
                        this.width = this.map[0].length * this.tileSize;
                    });
                }
                draw() {
                    if (!this.map) {
                        return;
                    }
                    const X = this.world.canvas.X;
                    X.fillStyle = "#aaa8";
                    for (let y = 0; y < this.map.length; y++) {
                        for (let x = 0; x < this.map[y].length; x++) {
                            if (this.map[y][x] !== " ") {
                                X.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                            }
                        }
                    }
                }
                getCollisionTiles(x, y) {
                    if (!this.map) {
                        return;
                    }
                    const xIndex = Math.floor(x / this.tileSize);
                    const yIndex = Math.floor(y / this.tileSize);
                    const rects = [];
                    if (this.isBlock(xIndex, yIndex)) {
                        rects.push(new Rectangle_1.Rectangle(xIndex * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize));
                    }
                    if (this.isBlock(xIndex - 1, yIndex)) {
                        let rect = new Rectangle_1.Rectangle((xIndex - 1) * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
                        if (this.isBlock(xIndex - 1, yIndex - 1)) {
                            rect.y -= this.tileSize;
                            rect.height += this.tileSize;
                        }
                        if (this.isBlock(xIndex - 1, yIndex + 1)) {
                            rect.height += this.tileSize;
                        }
                        rects.push(rect);
                    }
                    if (this.isBlock(xIndex + 1, yIndex)) {
                        let rect = new Rectangle_1.Rectangle((xIndex + 1) * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
                        if (this.isBlock(xIndex + 1, yIndex - 1)) {
                            rect.y -= this.tileSize;
                            rect.height += this.tileSize;
                        }
                        if (this.isBlock(xIndex + 1, yIndex + 1)) {
                            rect.height += this.tileSize;
                        }
                        rects.push(rect);
                    }
                    if (this.isBlock(xIndex, yIndex + 1)) {
                        let rect = new Rectangle_1.Rectangle(xIndex * this.tileSize, (yIndex + 1) * this.tileSize, this.tileSize, this.tileSize);
                        if (this.isBlock(xIndex - 1, yIndex + 1)) {
                            rect.x -= this.tileSize;
                            rect.width += this.tileSize;
                        }
                        if (this.isBlock(xIndex + 1, yIndex + 1)) {
                            rect.width += this.tileSize;
                        }
                        rects.push(rect);
                    }
                    if (this.isBlock(xIndex, yIndex - 1)) {
                        let rect = new Rectangle_1.Rectangle(xIndex * this.tileSize, (yIndex - 1) * this.tileSize, this.tileSize, this.tileSize);
                        if (this.isBlock(xIndex - 1, yIndex - 1)) {
                            rect.x -= this.tileSize;
                            rect.width += this.tileSize;
                        }
                        if (this.isBlock(xIndex + 1, yIndex - 1)) {
                            rect.width += this.tileSize;
                        }
                        rects.push(rect);
                    }
                    return rects;
                }
                isBlock(xIndex, yIndex) {
                    if (!this.map) {
                        return false;
                    }
                    return this.map[yIndex] && this.map[yIndex][xIndex] && this.map[yIndex][xIndex] !== ' ';
                }
            };
            exports_12("default", TileMap);
        }
    };
});
System.register("entities/collisions", ["engine/collision/isRectanglesColliding"], function (exports_13, context_13) {
    "use strict";
    var isRectanglesColliding_2, collisions;
    var __moduleName = context_13 && context_13.id;
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
    exports_13("registerCollisions", registerCollisions);
    function handleMovingStaticCollision(moving, block) {
        // modified from https://stackoverflow.com/a/29861691
        const dx = (moving.x + moving.width / 2)
            - (block.x + block.width / 2);
        const dy = (moving.y + moving.height / 2)
            - (block.y + block.height / 2);
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
            }
        ],
        execute: function () {
            exports_13("collisions", collisions = {
                types: {
                    static: Symbol(),
                    moving: Symbol(),
                    map: Symbol()
                }
            });
        }
    };
});
System.register("resources/dialogFetcher", ["resources/resourceFetcher"], function (exports_14, context_14) {
    "use strict";
    var resourceFetcher_2, DialogFetcher, dialogFetcher;
    var __moduleName = context_14 && context_14.id;
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
            exports_14("dialogFetcher", dialogFetcher = new DialogFetcher());
        }
    };
});
System.register("settings", [], function (exports_15, context_15) {
    "use strict";
    var settings;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [],
        execute: function () {
            exports_15("settings", settings = {
                keybindings: {
                    moveUp: ["KeyW", "ArrowUp"],
                    moveDown: ["KeyS", "ArrowDown"],
                    moveLeft: ["KeyA", "ArrowLeft"],
                    moveRight: ["KeyD", "ArrowRight"],
                    advanceDialog: ["Enter", "NumpadEnter", "Space"]
                }
            });
        }
    };
});
System.register("ui/NPCDialog", ["engine/CanvasElm", "settings"], function (exports_16, context_16) {
    "use strict";
    var CanvasElm_2, settings_1, NPCDialog;
    var __moduleName = context_16 && context_16.id;
    return {
        setters: [
            function (CanvasElm_2_1) {
                CanvasElm_2 = CanvasElm_2_1;
            },
            function (settings_1_1) {
                settings_1 = settings_1_1;
            }
        ],
        execute: function () {
            NPCDialog = class NPCDialog extends CanvasElm_2.CanvasElm {
                constructor(dialog) {
                    super();
                    this.dialog = dialog;
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
                    X.fillRect(8, 300, 500, 200);
                    X.fillStyle = "#aaa";
                    X.font = "24px Arial";
                    X.textBaseline = "top";
                    const lines = this.dialog[this.index].split("\n");
                    for (let y = 0; y < lines.length; y++) {
                        X.fillText(lines[y] || "[...]", 16, 308 + y * 36);
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
            exports_16("NPCDialog", NPCDialog);
        }
    };
});
System.register("entities/NPC", ["entities/Entity"], function (exports_17, context_17) {
    "use strict";
    var Entity_2, NPC;
    var __moduleName = context_17 && context_17.id;
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
                    this.x = x;
                    this.y = y;
                }
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#0f0";
                    X.fillRect(this.x, this.y, this.width, this.height);
                }
            };
            exports_17("NPC", NPC);
        }
    };
});
System.register("entities/Player", ["settings", "entities/collisions", "entities/Entity"], function (exports_18, context_18) {
    "use strict";
    var settings_2, collisions_3, Entity_3, Player;
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
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
                    super(...arguments);
                    this.collisionType = collisions_3.collisions.types.moving;
                    this.x = 500;
                    this.y = 500;
                }
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#f00";
                    X.fillRect(this.x, this.y, this.width, this.height);
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
                    this.x += dirX * 10;
                    this.y += dirY * 10;
                }
            };
            exports_18("Player", Player);
        }
    };
});
System.register("entities/NPCWithDialog", ["resources/dialogFetcher", "ui/NPCDialog", "entities/NPC", "entities/Player"], function (exports_19, context_19) {
    "use strict";
    var dialogFetcher_1, NPCDialog_1, NPC_1, Player_1, NPCWithDialog;
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [
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
                        this.world.addElm(new NPCDialog_1.NPCDialog(dialog));
                    });
                }
                dispose() {
                    throw new Error("Not implemented");
                }
            };
            exports_19("NPCWithDialog", NPCWithDialog);
        }
    };
});
System.register("index", ["engine/CanvasElm", "engine/World", "entities/collisions", "entities/NPCWithDialog", "entities/Player", "entities/TileMap"], function (exports_20, context_20) {
    "use strict";
    var CanvasElm_3, World_1, collisions_4, NPCWithDialog_1, Player_2, TileMap_1, world;
    var __moduleName = context_20 && context_20.id;
    function requanf() {
        world.draw();
        requestAnimationFrame(requanf);
    }
    return {
        setters: [
            function (CanvasElm_3_1) {
                CanvasElm_3 = CanvasElm_3_1;
            },
            function (World_1_1) {
                World_1 = World_1_1;
            },
            function (collisions_4_1) {
                collisions_4 = collisions_4_1;
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
            world = new World_1.World();
            world.addElm(new class TestElm extends CanvasElm_3.CanvasElm {
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#fff";
                    X.fillRect(performance.now() / 100, performance.now() / 100, 50, 50);
                }
            });
            world.addElm(new Player_2.Player());
            world.addElm(new NPCWithDialog_1.NPCWithDialog(70, 600));
            world.addElm(new NPCWithDialog_1.NPCWithDialog(94, 624));
            world.addElm(new TileMap_1.default());
            world.appendTo(document.body);
            world.keyboard.startListen();
            collisions_4.registerCollisions(world.collisionSystem.reactions);
            requanf();
        }
    };
});
