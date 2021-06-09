import { World } from "../engine/World.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec } from "../utils/vectors.js";
import { AestheticVectorArrow } from "../engine/components/vectorArrow/AestheticVectorArrow.js";
import { HitBox } from "../engine/canvas/HitBox.js";

let world;

const k = 8.988e9;

class ElectricVectorField extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;

        /** @type {ChargePoint[]} */
        this.charges = [];

        this.vectors = this.initVectorField(20, 20);
        this.vectorArrowDrawer = new AestheticVectorArrow();
    }

    setup(world) {
        super.setup(world);
        this.vectorArrowDrawer.setup(world);
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    initVectorField(width, height) {
        const vecArr2d = [];

        for (let y = 0; y < height; y++) {
            const row = [];

            for (let x = 0; x < width; x++) {
                row[x] = vec(0, 0);
            }

            vecArr2d[y] = row;
        }

        return vecArr2d;
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        for (let y = 0; y < this.vectors.length; y++) {
            const row = this.vectors[y];

            for (let x = 0; x < row.length; x++) {
                this.vectorArrowDrawer.setTail(vec(x * 10, y * 10));
                this.vectorArrowDrawer.setValue(row[x]);
                this.vectorArrowDrawer.draw();
            }
        }
    }

    /** @param {ChargePoint} charge */
    addCharge(charge) {
        this.charges.push(charge);
    }

    updateField() {
        for (let y = 0; y < this.vectors.length; y++) {
            const row = this.vectors[y];

            for (let x = 0; x < row.length; x++) {
                const pos = vec(x * 10, y * 10);
                row[x] = this._calculateField(pos);
            }
        }
    }

    _calculateField(pos) {
        let total = vec(0, 0);
        
        for (const charge of this.charges) {
            const diff = charge.pos.subtract(pos);
            total = total.add(
                diff.withMagnitude(-k * charge.coulombs / (diff.magnitude * diff.magnitude))
            );
        }

        return total;
    }
}

class ChargePoint extends CanvasElm {
    constructor(pos, chargeCoulombs) {
        super();
        this.pos = pos;
        this.coulombs = chargeCoulombs;

        this.dragging = false;

        this.hitbox = new HitBox(this.pos, vec(0, 0), 8);
        this.hitbox.mousedownHandler = () => {
            this.dragging = true;
            this.world.cursor.nextMouseUp().then(() => this.dragging = false);
        };
    }

    setup(world) {
        super.setup(world);
        world.addHitbox(this.hitbox);
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        if (this.dragging) {
            this.pos = this.world.cursor.clone();
            this.hitbox.setPos(this.pos);
        }

        X.fillStyle = "#ff0000";
        X.beginPath();
        X.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
        X.fill();
    }
}

const chargePoint = new ChargePoint(vec(4, 4), 1e-6);
const electricVectorField = new ElectricVectorField();

export function start(simulationView) {
    world = new World(simulationView);
    world.addElm(electricVectorField);
    electricVectorField.addCharge(chargePoint);
    world.addElm(chargePoint);

    console.log(electricVectorField);
}

export function update() {
    // chargePoint.pos = world.cursor;
    electricVectorField.updateField(); 

    world.draw();
}

export function stop() {
    world.setdown();
}

