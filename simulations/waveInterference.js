import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { Grid } from "../engine/components/Grid.js";
import { colors } from "../ui/colors.js";
import { vec } from "../utils/vectors.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";

const SPEED_SOUND = 340.29;

class Wave extends CanvasElm {
    constructor(pos) {
        super();

        this.pos = pos;

        this.phase = 0;
        this.amplitude = 4;
        this.frequency = 2 * Math.PI / 100;
        this.velocity = SPEED_SOUND;

        this.color = colors.white;
    }

    evalAtPos(pos) {
        return this.amplitude * Math.sin(this.phase + this.frequency * (pos - this.velocity * time));
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        X.save();
        X.translate(this.pos.x, this.pos.y);
        X.strokeStyle = this.color;
        X.lineWidth = 1;
        X.beginPath();
        X.moveTo(0, this.evalAtPos(0));
        for (let i = 0; i < 1000; i++) {
            X.lineTo(i, this.evalAtPos(i));
        }
        X.stroke();
        X.restore();
    }
}

class WaveInput extends Wave {
    constructor(pos) {
        super(pos);

        this.velocityInput = new VectorLinearInput(vec(this.velocity, 0), this.pos);
        this.velocityInput.onUserChange.addHandler(v => this.velocity = v.x);
        this.velocityInput.setUnitText("m/s");

        this.amplitudeInput = new VectorLinearInput(vec(0, this.amplitude), this.pos);
        this.amplitudeInput.onUserChange.addHandler(v => this.amplitude = v.y);
        this.amplitudeInput.setUnitText("m");

        this.phaseInput = new VectorLinearInput(vec(1, 0), this.pos.add(vec(0, -20)));
        this.phaseInput.setMagnitude(this.phase);
        this.phaseInput.onUserChange.addHandler(v => this.phase = -v.x);
        this.phaseInput.setUnitText("m");

        this.waveLengthInput = new VectorLinearInput(vec(this.frequency, 0), this.pos.add(vec(0, 20)));
        this.waveLengthInput.onUserChange.addHandler(v => this.frequency = v.x);
        this.waveLengthInput.setUnitText("m");
    }

    setup(world) {
        super.setup(world);
        world.addElm(this.velocityInput, this.amplitudeInput, this.phaseInput, this.waveLengthInput);
    }
}

class ResultantWave extends Wave {
    constructor(pos) {
        super(pos);

        /** @type {Wave[]} */
        this.waves = [];
        this.color = colors.red;
    }

    /** @param {Wave} wave */
    addWave(wave) {
        this.waves.push(wave);
    }

    evalAtPos(pos) {
        let total = 0;
        for (const wave of this.waves) {
            total += wave.evalAtPos(pos);
        }
        return total;
    }
}

export function start(world) {
    world.addElm(new Grid());

    const resultantWave = new ResultantWave(vec(0, 0));
    world.addElm(resultantWave);

    for (let i = 0; i < 2; i++) {
        const wave = new WaveInput(vec(0, (i + 1) * 100));
        world.addElm(wave);
        resultantWave.addWave(wave);
    }
}

let time = 0;

export function update(timeElapsed) {
    time += timeElapsed;
}
