import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { Grid } from "../engine/components/Grid.js";
import { colors } from "../ui/colors.js";
import { vec } from "../utils/vectors.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";
import { Elm } from "../utils/elements.js";
import { removeElmFromArray } from "../utils/removeElmFromArray.js";

const SPEED_SOUND = 340.29;

class Wave extends CanvasElm {
    constructor(pos) {
        super();

        this.pos = pos;

        this.phase = 0;
        this.amplitude = 4;
        this.waveLength = 100;
        this.velocity = SPEED_SOUND;

        this.color = colors.white;
    }

    evalAtPos(pos) {
        return this.amplitude * Math.sin(2 * Math.PI / this.waveLength * (this.phase + pos - this.velocity * time));
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
        this.velocityInput.setVariableName("v");

        this.amplitudeInput = new VectorLinearInput(vec(0, this.amplitude), this.pos);
        this.amplitudeInput.onUserChange.addHandler(v => {
            this.amplitude = v.y;
            if (this.amplitude === 0 && !this.amplitudeInput.inputElm.focused) {
                removeWave(this);
            }
        });
        this.amplitudeInput.setUnitText("m");
        this.amplitudeInput.setVariableName("A");

        this.phaseInput = new VectorLinearInput(vec(1, 0), this.pos.add(vec(0, -40)));
        this.phaseInput.setMagnitude(this.phase);
        this.phaseInput.onUserChange.addHandler(v => this.phase = -v.x);
        this.phaseInput.setUnitText("m");
        this.phaseInput.setVariableName("Φ");

        this.waveLengthInput = new VectorLinearInput(vec(this.waveLength, 0), this.pos.add(vec(0, 40)));
        this.waveLengthInput.onUserChange.addHandler(v => this.waveLength = v.x);
        this.waveLengthInput.setUnitText("m");
        this.waveLengthInput.setVariableName("λ");
    }

    setPos(pos) {
        this.pos = pos;
        this.velocityInput.setTailPos(this.pos);
        this.amplitudeInput.setTailPos(this.pos);
        this.phaseInput.setTailPos(this.pos.add(vec(0, -40)));
        this.waveLengthInput.setTailPos(this.pos.add(vec(0, 40)));
    }

    setup(world) {
        super.setup(world);
        world.addElm(this.velocityInput, this.amplitudeInput, this.phaseInput, this.waveLengthInput);
    }

    setdown() {
        this.world.removeElm(this.velocityInput, this.amplitudeInput, this.phaseInput, this.waveLengthInput);
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

    /** @param {Wave} wave */
    removeWave(wave) {
        removeElmFromArray(wave, this.waves);
    }

    evalAtPos(pos) {
        let total = 0;
        for (const wave of this.waves) {
            total += wave.evalAtPos(pos);
        }
        return total;
    }
}

class CreateWaveButton extends HTMLCanvasElm {
    constructor() {
        super();

        this.staticPosition = true;

        this.append(
            this.button = new Elm("button").append("Add wave")
                .on("mousedown", () => {
                    addWave();
                    this.button.elm.blur();
                })
        );
    }
}

/** @type {ResultantWave} */
let resultantWave;

/** @type {WaveInput[]} */
let waves;

let world;

export function start(newWorld) {
    world = newWorld;

    world.addElm(new Grid(), new CreateWaveButton());

    resultantWave = new ResultantWave(vec(0, 0));
    world.addElm(resultantWave);

    waves = [];

    for (let i = 0; i < 2; i++) {
        addWave();
    }
}

function addWave() {
    const wave = new WaveInput(vec(0, 0));

    waves.push(wave);
    world.addElm(wave);
    resultantWave.addWave(wave);

    updateWavePositions();
}

function removeWave(wave) {
    removeElmFromArray(wave, waves);
    world.removeElm(wave);
    resultantWave.removeWave(wave);
    updateWavePositions();
}

function updateWavePositions() {
    for (let i = 0; i < waves.length; i++) {
        waves[i].setPos(vec(0, (i + 1) * 200));
    }
}

let time = 0;

export function update(timeElapsed) {
    time += timeElapsed;
}
