import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";

export class DocsView extends View {
    constructor() {
        super("Docs");

        this.elm.append(
            "docs"
        );
    }
}
