import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";

export class SimulationListView extends View {
    constructor() {
        super("SimulationList");

        this.elm.append(
            new Elm("h1").append("Physics simulations"),
            new Elm().class("list").append(
                this.createSimulationLink("1d Motion", "1dMotion"),
                this.createSimulationLink("Projectile Motion", "projectileMotion"),
                this.createSimulationLink("Uniform Circular Motion", "uniformCircularMotion"),
                this.createSimulationLink("Uniform Circular Orbit", "uniformCircularOrbit"),
                this.createSimulationLink("Electric Field","electricField")
            )
        );
    }

    /**
     * @param {string} title
     * @param {string} simulationId
     */
    createSimulationLink(title, simulationId) {
        return new Elm("a")
            .class("simulationLink")
            .append(title)
            .attribute("href", "#" + simulationId);
    }
}
