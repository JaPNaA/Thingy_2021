import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";

export class DocsView extends View {
    /** @param {string} url */
    constructor(url) {
        super("Docs");

        this.url = url;
        this.frame = new Elm("iframe");
        this.frame.attribute("src", "/docs/" + url + ".html");

        this.elm.append(this.frame);
    }
    
}
