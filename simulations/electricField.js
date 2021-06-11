import { World } from "../engine/World.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec } from "../utils/vectors.js";
import { AestheticVectorArrow } from "../engine/components/vectorArrow/AestheticVectorArrow.js";
import { HitBox } from "../engine/canvas/HitBox.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";
import { Elm, InputElm } from "../utils/elements.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";

let world;

const k = 8.988e9;

class ElectricVectorField extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;

        /** @type {ChargePoint[]} */
        this.charges = [];

        this.spacing = 15;

        this.vectors = this.initVectorField(40, 40);
        this.vectorArrowDrawer = new AestheticVectorArrow();
    }

    setup(world) {
        super.setup(world);
        this.vectorArrowDrawer.setup(world);
    }

    setdown() {
        this.charges.length = 0;
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
                this.vectorArrowDrawer.setTail(vec(x * this.spacing, y * this.spacing));
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
                const pos = vec(x * this.spacing, y * this.spacing);
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

class CreateChargeButton extends HTMLCanvasElm {
    constructor() {
        super();

        this.staticPosition = true;

        this.append(
            new Elm("button").append("Create particle")
        );
    }
}

class ChargePoint extends CanvasElm {
    constructor(pos, chargeCoulombs) {
        super();
        this.pos = pos;
        this.coulombs = chargeCoulombs;

        this.dragging = false;
        this.dirty = true;

        this.hitbox = new HitBox(this.pos, vec(0, 0), 8);
        this.hitbox.mousedownHandler = () => {
            this.dragging = true;
            this.world.cursor.nextMouseUp().then(() => this.dragging = false);
        };

        this.chargeInput = new ScalarInputElm();
        this.chargeInput.addTextAfter("μC");
        this.chargeInput.setValue(chargeCoulombs * 1e6);
        this.chargeInput.onUserChange.addHandler(value => {
            this.coulombs = value * 1e-6;
            this.dirty = true;
        });
    }

    setup(world) {
        super.setup(world);
        world.addElm(this.chargeInput);
        world.addHitbox(this.hitbox);
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        if (this.dragging) {
            this.pos = this.world.cursor.clone();
            this.hitbox.setPos(this.pos);
            this.dirty = true;
        }

        X.fillStyle = this.coulombs < 0 ? "#0008ff" : "#ff0000";
        X.beginPath();
        X.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
        X.fill();

        this.chargeInput.setPos(this.pos);
    }
}

/** @type {ChargePoint[]} */
let chargePoints = [];
const electricVectorField = new ElectricVectorField();

export function start(simulationView) {
    world = new World(simulationView);
    world.addElm(electricVectorField);
    world.addElm(new CreateChargeButton());

    chargePoints = initChargePoints();
    for (const chargePoint of chargePoints) {
        electricVectorField.addCharge(chargePoint);
        world.addElm(chargePoint);
    }
}

function initChargePoints() {
    const arr = [];
    
    let i;
    for (i = 0; i < 3; i++) {
        arr.push(new ChargePoint(vec(200 + i * 16, 200 + i * 16), 1e-6));
    }
    for (; i < 6; i++) {
        arr.push(new ChargePoint(vec(200 + i * 16, 200 + i * 16), -1e-6));
    }

    return arr;
}

export function update() {
    // chargePoint.pos = world.cursor;

    let shouldUpdate = false;
    for (const chargePoint of chargePoints) {
        if (chargePoint.dirty) {
            shouldUpdate = true;
            chargePoint.dirty = false;
        }
    }

    if (shouldUpdate) {
        electricVectorField.updateField();
    }

    world.draw();
}

export function stop() {
    world.setdown();
}

