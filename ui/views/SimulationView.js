import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";
import { Canvas } from "../Canvas.js";

export class SimulationView extends View {
    constructor(simulationName) {
        super("Simulation");

        this.canvas = new Canvas();
        this.canvas.resizeToScreen();

        this.module = undefined;
        this.loadPromise = this.loadSimulation(simulationName);
        this.elm.append(this.canvas);

        this.requestAnimationFrameId = 0;
    }

    async _setup() {
        await this.loadPromise;
        
        this.requestAnimationFrameHandler();
    }

    _setdown() {
        cancelAnimationFrame(this.requestAnimationFrameId);
    }

    requestAnimationFrameHandler() {
        this.module.update();
        this.requestAnimationFrameId = requestAnimationFrame(() => this.requestAnimationFrameHandler());
    }
    
    async loadSimulation(name) {
        const module = await import(`/simulations/${name}.js`);
        module.start(this);
        this.module = module;
    }
}
