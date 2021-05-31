import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";
import { Canvas } from "../../engine/canvas/Canvas.js";
import { HTMLCanvas } from "../../engine/htmlCanvas/HTMLCanvas.js";
import { loadingIndicator } from "../loadingIndicator.js";


/**
 * View that loads a simulation module.
 * 
 * A module modular .js file with at least 3 exported functions:
 *   - start(): void
 *   - update(timeElapsedSeconds: number): void
 *   - end(): void
 * and may also contain:
 *   - resize(): void
 */
export class SimulationView extends View {
    constructor(simulationName) {
        super("Simulation");

        this.canvas = new Canvas();
        this.canvas.resizeToScreen();

        this.htmlCanvas = new HTMLCanvas();

        this.module = undefined;
        this.loadPromise = this.loadSimulation(simulationName);

        this.elm.append(this.canvas);
        this.elm.append(this.htmlCanvas);

        this.requestAnimationFrameId = 0;
        this.lastTime = performance.now();
    }

    resize() {
        this.canvas.resizeToScreen();
        if (this.module && this.module.resize) {
            this.module.resize();
        }
    }

    async _setup() {
        await this.loadPromise;
        
        this.requestAnimationFrameHandler();
    }

    _setdown() {
        cancelAnimationFrame(this.requestAnimationFrameId);
        if (this.module) {
            this.module.stop();
        }
    }

    requestAnimationFrameHandler() {
        const now = performance.now();
        const timeElapsed = now - this.lastTime;
        this.lastTime = now;

        this.module.update(timeElapsed / 1000);
        this.requestAnimationFrameId = requestAnimationFrame(() => this.requestAnimationFrameHandler());
    }
    
    async loadSimulation(name) {
        let module;
        loadingIndicator.show();

        try {
            module = await import(`/simulations/${name}.js`);

            module.start(this);
            this.module = module;
        } catch (err) {
            this.elm.append("Failed to load module -- it was probably not found.");
            throw err;
        } finally {
            loadingIndicator.hide();
        }
    }
}
