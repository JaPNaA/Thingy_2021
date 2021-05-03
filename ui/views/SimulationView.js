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
    }

    async _setup() {
        await this.loadPromise;
        
        setInterval(() => {
            this.module.update();
        }, 30);
    }
    
    async loadSimulation(name) {
        const module = await import(`/simulations/${name}.js`);
        module.start(this);
        this.module = module;
    }
}
