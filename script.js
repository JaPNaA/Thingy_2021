import { userInterface } from "./ui/userInterface.js";
import { SimulationListView } from "./ui/views/SimulationListView.js"
import { SimulationView } from "./ui/views/SimulationView.js";

function navigateByURL() {
    if (location.hash) {
        userInterface.setView(new SimulationView(location.hash.slice(1)));
    } else {
        userInterface.setView(new SimulationListView());
    }
}

navigateByURL();

addEventListener("hashchange", () => navigateByURL());
