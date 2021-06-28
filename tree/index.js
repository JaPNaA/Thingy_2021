class Renderer {
    /**
     * @param {EntireMap} entireMap 
     */
    constructor(entireMap) {
        this._elm = document.createElement("div");
        this._elm.classList.add("renderer");

        this._canvas = document.createElement("canvas");
        this._canvas.classList.add("canvas");
        this._elm.appendChild(this._canvas);

        this._elmsContainer = document.createElement("div");
        this._elmsContainer.classList.add("elmsContainer");
        this._elm.appendChild(this._elmsContainer);

        this._map = entireMap;
        this._context = this._canvas.getContext("2d");

        this._offsetX = 0;
        this._offsetY = 0;

        /** @type {Set<MapObject>} */
        this.addedMapObjectsSet = new Set();

        this._addEventListeners();
    }

    /**
     * @param {HTMLElement} parent 
     */
    appendTo(parent) {
        parent.appendChild(this._elm);
    }

    /**
     * @param {number} width 
     * @param {number} height 
     */
    updateCanvasSize(width, height) {
        this._canvas.width = width;
        this._canvas.height = height;
    }

    updateElms() {
        while (this._elmsContainer.firstChild) {
            this._elmsContainer.removeChild(this._elmsContainer.firstChild);
        }

        const que = [];

        for (const object of this._map.rootObjects) {
            que.push(object);
        }

        while (que.length > 0) {
            const object = que.pop();
            this._elmsContainer.appendChild(object.getElm());
            for (const child of object.children) {
                que.push(child);
            }
        }
    }

    render() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        /** @type {[number, number, MapObject, MapObject | null][]} */
        const que = [];

        for (const object of this._map.rootObjects) {
            que.push([this._offsetX, this._offsetY, object, null]);
        }

        while (que.length > 0) {
            const [offsetX, offsetY, object, parentObject] = que.pop();

            const elm = object.getElm();
            const newOffsetX = offsetX + object.relX;
            const newOffsetY = offsetY + object.relY;
            elm.style.left = (newOffsetX - object.width / 2) + "px";
            elm.style.top = (newOffsetY - object.height / 2) + "px";
            elm.style.width = object.width + "px";
            elm.style.height = object.height + "px";

            if (parentObject) {
                this._context.beginPath();
                this._context.moveTo(offsetX, offsetY + parentObject.height / 2);
                this._context.lineTo(newOffsetX, newOffsetY - object.height / 2);
                this._context.stroke();
            }

            for (const child of object.children) {
                que.push([newOffsetX, newOffsetY, child, object]);
            }
        }
    }

    _addEventListeners() {
        this._canvas.addEventListener("mousedown", () => {
            handleMousemoveUntilMouseup(e => {
                this._offsetX += e.movementX;
                this._offsetY += e.movementY;
            });
        });
    }
}

class EntireMap {
    constructor() {
        /** @type {MapObject[]} */
        this.rootObjects = [];
    }

    /**
     * Adds a MapObject to the root of the entire map
     * @param {MapObject} object 
     */
    addRootObject(object) {
        this.rootObjects.push(object);
    }
}

class MapObject {
    /** @param {string} content */
    constructor(content) {
        this.relX = 0;
        this.relY = 0;
        this.width = 128;
        this.height = 32;

        /** @type {MapObject[]} */
        this.children = [];

        this._content = content;
        this._elm = this._createElm();
    }

    organizeChildren() {
        const spacing = 200;
        let currX = -(this.children.length - 1) * spacing / 2;

        for (const child of this.children) {
            child.relY = 200;
            child.relX = currX;
            currX += spacing;
        }
    }

    organizeChildrenRecusive() {
        this.organizeChildren();

        for (const child of this.children) {
            child.organizeChildrenRecusive();
        }
    }

    getElm() {
        return this._elm;
    }

    _createElm() {
        const elm = document.createElement("div");
        elm.classList.add("mapObject");
        elm.setAttribute("contenteditable", "true");
        elm.innerText = this._content;

        elm.addEventListener("mousedown", e => {
            if (e.button === 2) {
                this.children.push(new MapObject("click-added"));
                this.organizeChildren();
                renderer.updateElms(); // todo: shouldn't reference global variable
            } else {
                handleMousemoveUntilMouseup(e => {
                    this.relX += e.movementX;
                    this.relY += e.movementY;
                });
            }
        });

        elm.addEventListener("contextmenu", e => e.preventDefault());

        return elm;
    }
}

const mousemoveHandlersUntilMouseup = [];

/** @param {(e: MouseEvent) => void} handler */
function handleMousemoveUntilMouseup(handler) {
    mousemoveHandlersUntilMouseup.push(handler);
}

addEventListener("mousemove", function (e) {
    for (const handler of mousemoveHandlersUntilMouseup) {
        handler(e);
    }
});

addEventListener("mouseup", function () {
    mousemoveHandlersUntilMouseup.length = 0;
});

const map = new EntireMap();

const node = new MapObject("hello world");
node.children.push(new MapObject("hello..."));
node.children.push(new MapObject("... world!"));
node.organizeChildrenRecusive();

map.addRootObject(
    node
);

const renderer = new Renderer(map);

renderer.updateCanvasSize(innerWidth, innerHeight);
renderer.updateElms();
renderer.appendTo(document.body);

function reqanf() {
    renderer.render();
    requestAnimationFrame(reqanf);
}

reqanf();
