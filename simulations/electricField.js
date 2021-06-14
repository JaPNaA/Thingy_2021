import { World } from "../engine/World.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec } from "../utils/vectors.js";
import { AestheticVectorArrow } from "../engine/components/vectorArrow/AestheticVectorArrow.js";
import { HitBox } from "../engine/canvas/HitBox.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";
import { Elm, InputElm } from "../utils/elements.js";
import { ScalarInputElm } from "../engine/components/ScalarInputElm.js";
import { removeElmFromArray } from "../utils/removeElmFromArray.js";
import { colors } from "../ui/colors.js";

let world;

const k = 8.988e9;

class ElectricVectorField extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;

        /** @type {ChargePoint[]} */
        this.charges = [];

        this.spacing = 15;
        this.dirty = true;

        this.vectors = this.initVectorField(40, 40);
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

    removeCharge(charge) {
        removeElmFromArray(charge, this.charges);
        this.dirty = true;
    }

    updateField() {
        if (!this._isDirty()) { return; }

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

    _isDirty() {
        if (this.dirty) {
            this.dirty = false;
            return true;
        }

        for (const charge of this.charges) {
            if (charge.dirty) {
                return true;
            }
        }
        return false;
    }
}

class CreateChargeButton extends HTMLCanvasElm {
    constructor() {
        super();

        this.staticPosition = true;

        this.append(
            this.button = new Elm("button").append("Create particle")
                .on("mousedown", () => {
                    const chargePoint = new ChargePoint(world.cursor.clone(), 1e-6);
                    world.addElm(chargePoint);
                    this.button.elm.blur();
                })
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
            if (value === 0 && !this.chargeInput.focused) {
                this.remove();
            }
        });
        this.chargeInput.setPos(this.pos);
    }

    setup(world) {
        super.setup(world);
        world.addElm(this.chargeInput);
        world.addHitbox(this.hitbox);
        electricVectorField.addCharge(this);
    }

    setdown() {
        electricVectorField.removeCharge(this); console.log(this);
        world.removeElm(this.chargeInput);
        world.removeHitbox(this.hitbox);
    }

    update() {
        if (this.dragging) {
            this.pos = this.world.cursor.clone();
            this.hitbox.setPos(this.pos);
            this.dirty = true;
        }

        this.chargeInput.setPos(this.pos);
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        X.fillStyle = this.coulombs < 0 ? colors.blue : colors.red;
        X.beginPath();
        X.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
        X.fill();
    }

    remove() {
        world.removeElm(this);
    }
}

const electricVectorField = new ElectricVectorField();

export function start(newWorld) {
    world = newWorld;
    world.addElm(electricVectorField);
    world.addElm(new CreateChargeButton());

    const chargePoints = initChargePoints();
    for (const chargePoint of chargePoints) {
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
    electricVectorField.updateField();
}
