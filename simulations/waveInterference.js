import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { Grid } from "../engine/components/Grid.js";
import { colors } from "../ui/colors.js";

const SPEED_SOUND = 340.29;

class Wave extends CanvasElm {
    constructor() {
        super();

        this.phase = 0;
        this.amplitude = 1;
        this.frequency = 2 * Math.PI / 100;
        this.velocity = SPEED_SOUND;
    }

    evalAtPos(pos) {
        return this.amplitude * Math.sin(this.phase + this.frequency * (pos - this.velocity * time));
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        X.strokeStyle = colors.white;
        X.lineWidth = 1;
        X.beginPath();
        X.moveTo(0, this.evalAtPos(0));
        for (let i = 0; i < 1000; i++) {
            X.lineTo(i, this.evalAtPos(i));
        }
        X.stroke();
    }
}

export function start(world) {
    world.addElm(new Grid(), new Wave());
}

let time = 0;

export function update(timeElapsed) {
    time += timeElapsed;
}
