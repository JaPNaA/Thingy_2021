import { World } from "../engine/World.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec } from "../utils/vectors.js";
import { VectorArrow } from "../engine/components/vectorArrow/VectorArrow.js";

let world;

const k = 8.988e9;

class ElectricVectorField extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;

        /** @type {ChargePoint[]} */
        this.charges = [];

        this.vectors = this.initVectorField(20, 20);
        this.vectorArrowDrawer = new VectorArrow();
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

        X.strokeStyle = "#ffffff";
        X.beginPath();

        for (let y = 0; y < this.vectors.length; y++) {
            const row = this.vectors[y];

            for (let x = 0; x < row.length; x++) {
                this.vectorArrowDrawer.setTail(vec(x * 10, y * 10));
                this.vectorArrowDrawer.setValue(row[x]);
                this.vectorArrowDrawer.draw();
            }
        }

        X.stroke();
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
    }
}

const cursorChargePoint = new ChargePoint(vec(4, 4), 1e-6);
const electricVectorField = new ElectricVectorField();

export function start(simulationView) {
    world = new World(simulationView);
    world.addElm(electricVectorField);
    electricVectorField.addCharge(cursorChargePoint);
    console.log(electricVectorField);
}

export function update() {
    cursorChargePoint.pos = world.cursor;
    electricVectorField.updateField(); 

    world.draw();
}

export function stop() {
    world.setdown();
}

