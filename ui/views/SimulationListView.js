import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";
import { DocsView } from "./DocsView.js";
import { SimulationView } from "./SimulationView.js";
import { camelToTitleCase } from "../../utils/camelToTitleCase.js";
import { userInterface } from "../userInterface.js";
import { locationHash } from "../locationHash.js";

export class SimulationListView extends View {
    constructor() {
        super("SimulationList");

        this.elm.append(
            new Elm("h1").append("Physics simulations"),
            new Elm().class("list").append(
                this.createSimulationLink("1dMotion"),
                this.createSimulationLink("projectileMotion"),
                this.createSimulationLink("uniformCircularMotion"),
                this.createSimulationLink("uniformCircularOrbit"),
                this.createSimulationLink("electricField")
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
     * @param {string} simulationId
     */
    createSimulationLink(simulationId) {
        return new Elm().class("simulationLink").append(
            new Elm("a")
                .append(camelToTitleCase(simulationId))
                .attribute("href", "#" + simulationId)
                .on("click", e => {
                    e.preventDefault();
                    userInterface.addView(new SimulationView(simulationId));
                    locationHash.setHash(simulationId);
                    userInterface.closeView(this);
                })
        );
    }
}
