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
System.register("engine/collision/CollisionSystem", ["engine/collision/CollisionReactionMap"], function (exports_5, context_5) {
    "use strict";
    var CollisionReactionMap_1, CollisionSystem;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (CollisionReactionMap_1_1) {
                CollisionReactionMap_1 = CollisionReactionMap_1_1;
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
                            if (rect1.x < rect2.x + rect2.width &&
                                rect1.x + rect1.width > rect2.x &&
                                rect1.y < rect2.y + rect2.height &&
                                rect1.y + rect1.height > rect2.y) {
                                this.reactions.triggerReaction(this.hitboxes[i], this.hitboxes[j]);
                            }
                        }
                    }
                }
            };
            exports_5("CollisionSystem", CollisionSystem);
        }
    };
});
System.register("engine/Keyboard", [], function (exports_6, context_6) {
    "use strict";
    var Keyboard;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Keyboard = class Keyboard {
                constructor() {
                    this.keys = {};
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
                }
            };
            exports_6("default", Keyboard);
        }
    };
});
System.register("engine/World", ["engine/Canvas", "engine/collision/CollisionSystem", "engine/Keyboard"], function (exports_7, context_7) {
    "use strict";
    var Canvas_1, CollisionSystem_1, Keyboard_1, World;
    var __moduleName = context_7 && context_7.id;
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
                draw() {
                    this.canvas.X.fillStyle = "#000000";
                    this.canvas.X.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    for (const elm of this.elms) {
                        elm.draw();
                    }
                    this.collisionSystem._checkCollisions();
                }
                appendTo(parent) {
                    this.canvas.appendTo(parent);
                }
            };
            exports_7("World", World);
        }
    };
});
System.register("engine/CanvasElm", [], function (exports_8, context_8) {
    "use strict";
    var CanvasElm;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [],
        execute: function () {
            CanvasElm = class CanvasElm {
                setWorld(world) {
                    this.world = world;
                }
            };
            exports_8("CanvasElm", CanvasElm);
        }
    };
});
System.register("entities/Entity", ["engine/CanvasElm", "engine/collision/Hitbox", "entities/collisions"], function (exports_9, context_9) {
    "use strict";
    var CanvasElm_1, Hitbox_1, collisions_1, Entity;
    var __moduleName = context_9 && context_9.id;
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
            };
            exports_9("Entity", Entity);
        }
    };
});
System.register("entities/collisions", [], function (exports_10, context_10) {
    "use strict";
    var collisions;
    var __moduleName = context_10 && context_10.id;
    function registerCollisions(collisionReactionMap) {
        collisionReactionMap.setCollisionReaction(collisions.types.moving, collisions.types.static, function (moving, block) {
            // modified from https://stackoverflow.com/a/29861691
            const dx = (moving.rectangle.x + moving.rectangle.width / 2)
                - (block.rectangle.x + block.rectangle.width / 2);
            const dy = (moving.rectangle.y + moving.rectangle.height / 2)
                - (block.rectangle.y + block.rectangle.height / 2);
            const avgWidth = (moving.rectangle.width + block.rectangle.width) / 2;
            const avgHeight = (moving.rectangle.height + block.rectangle.height) / 2;
            const crossWidth = avgWidth * dy;
            const crossHeight = avgHeight * dx;
            if (crossWidth > crossHeight) {
                if (crossWidth > -crossHeight) {
                    // collision at bottom of block
                    moving.rectangle.y = block.rectangle.y + block.rectangle.height;
                }
                else {
                    // collision at left of block
                    moving.rectangle.x = block.rectangle.x - moving.rectangle.width;
                }
            }
            else {
                if (crossWidth > -crossHeight) {
                    // collision at right of block
                    moving.rectangle.x = block.rectangle.x + block.rectangle.width;
                }
                else {
                    // collision at top of block
                    moving.rectangle.y = block.rectangle.y - moving.rectangle.height;
                }
            }
        });
    }
    exports_10("registerCollisions", registerCollisions);
    return {
        setters: [],
        execute: function () {
            exports_10("collisions", collisions = {
                types: {
                    static: Symbol(),
                    moving: Symbol()
                }
            });
        }
    };
});
System.register("ui/NPCDialog", ["engine/CanvasElm"], function (exports_11, context_11) {
    "use strict";
    var CanvasElm_2, NPCDialog;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (CanvasElm_2_1) {
                CanvasElm_2 = CanvasElm_2_1;
            }
        ],
        execute: function () {
            NPCDialog = class NPCDialog extends CanvasElm_2.CanvasElm {
                constructor(dialog) {
                    super();
                    this.dialog = dialog;
                }
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#4448";
                    X.fillRect(8, 300, 500, 200);
                    X.fillStyle = "#aaa";
                    X.font = "24px Arial";
                    X.textBaseline = "top";
                    X.fillText(this.dialog[0], 16, 308);
                }
            };
            exports_11("NPCDialog", NPCDialog);
        }
    };
});
System.register("entities/NPC", ["entities/Entity"], function (exports_12, context_12) {
    "use strict";
    var Entity_1, NPC;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (Entity_1_1) {
                Entity_1 = Entity_1_1;
            }
        ],
        execute: function () {
            NPC = class NPC extends Entity_1.Entity {
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
            exports_12("NPC", NPC);
        }
    };
});
System.register("entities/NPCWithDialog", ["ui/NPCDialog", "entities/NPC"], function (exports_13, context_13) {
    "use strict";
    var NPCDialog_1, NPC_1, NPCWithDialog;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (NPCDialog_1_1) {
                NPCDialog_1 = NPCDialog_1_1;
            },
            function (NPC_1_1) {
                NPC_1 = NPC_1_1;
            }
        ],
        execute: function () {
            NPCWithDialog = class NPCWithDialog extends NPC_1.NPC {
                constructor() {
                    super(...arguments);
                    this.dialogOpen = false;
                }
                onCollision() {
                    if (this.dialogOpen) {
                        return;
                    }
                    this.dialogOpen = true;
                    this.world.addElm(new NPCDialog_1.NPCDialog(["こら！"]));
                }
            };
            exports_13("NPCWithDialog", NPCWithDialog);
        }
    };
});
System.register("settings", [], function (exports_14, context_14) {
    "use strict";
    var settings;
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
            exports_14("settings", settings = {
                keybindings: {
                    moveUp: ["KeyW"],
                    moveDown: ["KeyS"],
                    moveLeft: ["KeyA"],
                    moveRight: ["KeyD"]
                }
            });
        }
    };
});
System.register("entities/Player", ["settings", "entities/collisions", "entities/Entity"], function (exports_15, context_15) {
    "use strict";
    var settings_1, collisions_2, Entity_2, Player;
    var __moduleName = context_15 && context_15.id;
    return {
        setters: [
            function (settings_1_1) {
                settings_1 = settings_1_1;
            },
            function (collisions_2_1) {
                collisions_2 = collisions_2_1;
            },
            function (Entity_2_1) {
                Entity_2 = Entity_2_1;
            }
        ],
        execute: function () {
            Player = class Player extends Entity_2.Entity {
                constructor() {
                    super(...arguments);
                    this.collisionType = collisions_2.collisions.types.moving;
                }
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#f00";
                    X.fillRect(this.x, this.y, this.width, this.height);
                    let dirX = 0;
                    let dirY = 0;
                    if (this.world.keyboard.isDown(settings_1.settings.keybindings.moveLeft)) {
                        dirX--;
                    }
                    if (this.world.keyboard.isDown(settings_1.settings.keybindings.moveRight)) {
                        dirX++;
                    }
                    if (this.world.keyboard.isDown(settings_1.settings.keybindings.moveDown)) {
                        dirY++;
                    }
                    if (this.world.keyboard.isDown(settings_1.settings.keybindings.moveUp)) {
                        dirY--;
                    }
                    this.x += dirX * 10;
                    this.y += dirY * 10;
                }
                onCollision() {
                    console.log("ow!");
                }
            };
            exports_15("Player", Player);
        }
    };
});
System.register("index", ["engine/CanvasElm", "engine/World", "entities/collisions", "entities/NPCWithDialog", "entities/Player"], function (exports_16, context_16) {
    "use strict";
    var CanvasElm_3, World_1, collisions_3, NPCWithDialog_1, Player_1, world;
    var __moduleName = context_16 && context_16.id;
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
            function (collisions_3_1) {
                collisions_3 = collisions_3_1;
            },
            function (NPCWithDialog_1_1) {
                NPCWithDialog_1 = NPCWithDialog_1_1;
            },
            function (Player_1_1) {
                Player_1 = Player_1_1;
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
            world.addElm(new Player_1.Player());
            world.addElm(new NPCWithDialog_1.NPCWithDialog(50, 200));
            world.appendTo(document.body);
            world.keyboard.startListen();
            collisions_3.registerCollisions(world.collisionSystem.reactions);
            requanf();
        }
    };
});