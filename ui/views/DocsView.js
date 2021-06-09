import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";

export class DocsView extends View {
    /** @param {string} url */
    constructor(url) {
        super("Docs");

        this.url = url;
        this.frame = new Elm("iframe");
        this.frame.attribute("src", "/docs/_DocsView.html");

        this.docFetch = fetch("/docs/" + url + ".html");

        this.elm.append(this.frame);

        this.frame.elm.addEventListener("load", async () => {
            const frameDoc = this.frame.elm.contentDocument;
            new Elm("base")
                .attribute("href", "/docs/" + url)
                .appendTo(frameDoc.head);

            const text = await this.docFetch.then(e => e.text());
            frameDoc.body.innerHTML = text;
        });
    }
}
