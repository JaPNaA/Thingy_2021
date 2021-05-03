import { View } from "../View.js";
import { SimulationView } from "./SimulationView.js";
import { Elm } from "../../utils/elements.js";
import { userInterface } from "../userInterface.js";

export class SimulationListView extends View {
    constructor() {
        super("SimulationList");

        this.elm.append(
            new Elm("a").append("Projectile Motion")
                .on("click", () => userInterface.setView(new SimulationView("projectileMotion")))
        );
    }
}
