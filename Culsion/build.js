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
System.register("engine/CollisionSystem", [], function (exports_3, context_3) {
    "use strict";
    var CollisionSystem;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            CollisionSystem = class CollisionSystem {
                constructor() {
                    this.hitboxes = [];
                }
                addHitbox(rectangle) {
                    this.hitboxes.push(rectangle);
                }
                _checkCollisions() {
                    const numHitboxes = this.hitboxes.length;
                    for (let i = 0; i < numHitboxes; i++) {
                        for (let j = i + 1; j < numHitboxes; j++) {
                            if (this.hitboxes[i].x < this.hitboxes[j].x + this.hitboxes[j].width &&
                                this.hitboxes[i].x + this.hitboxes[i].width > this.hitboxes[j].x &&
                                this.hitboxes[i].y < this.hitboxes[j].y + this.hitboxes[j].height &&
                                this.hitboxes[i].y + this.hitboxes[i].height > this.hitboxes[j].y) {
                                console.log("collision");
                            }
                        }
                    }
                }
            };
            exports_3("CollisionSystem", CollisionSystem);
        }
    };
});
System.register("engine/Keyboard", [], function (exports_4, context_4) {
    "use strict";
    var Keyboard;
    var __moduleName = context_4 && context_4.id;
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
            exports_4("default", Keyboard);
        }
    };
});
System.register("engine/World", ["engine/Canvas", "engine/CollisionSystem", "engine/Keyboard"], function (exports_5, context_5) {
    "use strict";
    var Canvas_1, CollisionSystem_1, Keyboard_1, World;
    var __moduleName = context_5 && context_5.id;
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
            exports_5("World", World);
        }
    };
});
System.register("engine/CanvasElm", [], function (exports_6, context_6) {
    "use strict";
    var CanvasElm;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            CanvasElm = class CanvasElm {
                setWorld(world) {
                    this.world = world;
                }
            };
            exports_6("CanvasElm", CanvasElm);
        }
    };
});
System.register("entities/Entity", ["engine/CanvasElm"], function (exports_7, context_7) {
    "use strict";
    var CanvasElm_1, Entity;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (CanvasElm_1_1) {
                CanvasElm_1 = CanvasElm_1_1;
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
                }
                setWorld(world) {
                    super.setWorld(world);
                    world.collisionSystem.addHitbox(this);
                }
            };
            exports_7("Entity", Entity);
        }
    };
});
System.register("entities/NPC", ["entities/Entity"], function (exports_8, context_8) {
    "use strict";
    var Entity_1, NPC;
    var __moduleName = context_8 && context_8.id;
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
            exports_8("NPC", NPC);
        }
    };
});
System.register("settings", [], function (exports_9, context_9) {
    "use strict";
    var settings;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            exports_9("settings", settings = {
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
System.register("entities/Player", ["settings", "entities/Entity"], function (exports_10, context_10) {
    "use strict";
    var settings_1, Entity_2, Player;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (settings_1_1) {
                settings_1 = settings_1_1;
            },
            function (Entity_2_1) {
                Entity_2 = Entity_2_1;
            }
        ],
        execute: function () {
            Player = class Player extends Entity_2.Entity {
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
            };
            exports_10("Player", Player);
        }
    };
});
System.register("index", ["engine/CanvasElm", "engine/World", "entities/NPC", "entities/Player"], function (exports_11, context_11) {
    "use strict";
    var CanvasElm_2, World_1, NPC_1, Player_1, world;
    var __moduleName = context_11 && context_11.id;
    function requanf() {
        world.draw();
        requestAnimationFrame(requanf);
    }
    return {
        setters: [
            function (CanvasElm_2_1) {
                CanvasElm_2 = CanvasElm_2_1;
            },
            function (World_1_1) {
                World_1 = World_1_1;
            },
            function (NPC_1_1) {
                NPC_1 = NPC_1_1;
            },
            function (Player_1_1) {
                Player_1 = Player_1_1;
            }
        ],
        execute: function () {
            world = new World_1.World();
            world.addElm(new class TestElm extends CanvasElm_2.CanvasElm {
                draw() {
                    const X = this.world.canvas.X;
                    X.fillStyle = "#fff";
                    X.fillRect(performance.now() / 100, performance.now() / 100, 50, 50);
                }
            });
            world.addElm(new Player_1.Player());
            world.addElm(new NPC_1.NPC(50, 200));
            world.appendTo(document.body);
            world.keyboard.startListen();
            requanf();
        }
    };
});
