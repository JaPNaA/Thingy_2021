import { UserInterface } from "./ui/UserInterface.js";
import { SimulationListView } from "./ui/views/SimulationListView.js"

const ui = new UserInterface();

ui.elm.appendTo(document.body);

ui.setView(new SimulationListView());

ui.onResize();

addEventListener("resize", () => ui.onResize());

