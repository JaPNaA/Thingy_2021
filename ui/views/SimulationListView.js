import { View } from "../View.js";
import { SimulationView } from "./SimulationView.js";
import { Elm } from "../../utils/elements.js";
import { userInterface } from "../userInterface.js";

export class SimulationListView extends View {
    constructor() {
        super("SimulationList");

        this.elm.append(
            new Elm("h1").append("Physics simulations"),
            new Elm().class("list").append(
                this.createSimulationLink("Projectile Motion", "projectileMotion")
            )
        )

        this.elm.append(
            
        );
    }

    /**
     * @param {string} title
     * @param {string} simulationId
     */
    createSimulationLink(title, simulationId) {
        return new Elm("a")
            .append(title)
            .attribute("href", "#" + simulationId)
            .on("click", () => userInterface.setView(new SimulationView(simulationId)))
    }
}
