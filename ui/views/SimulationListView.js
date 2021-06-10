import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";
import { DocsView } from "./DocsView.js";
import { SimulationView } from "./SimulationView.js";
import { userInterface } from "../userInterface.js";

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
            ),
            new Elm().append(
                new Elm("a").attribute("href", "#").append("Help")
                    .on("click", () => {
                        userInterface.addView(new DocsView("help"))
                    })
            )
        );
    }

    /**
     * @param {string} title
     * @param {string} simulationId
     */
    createSimulationLink(title, simulationId) {
        return new Elm().class("simulationLink").append(
            new Elm("a")
                .append(title)
                .attribute("href", "#" + simulationId)
                .on("click", e => {
                    e.preventDefault();
                    userInterface.addView(new SimulationView(simulationId));
                    userInterface.closeView(this);
                })
        );
    }
}
