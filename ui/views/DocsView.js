import { View } from "../View.js";
import { Elm } from "../../utils/elements.js";
import { userInterface } from "../userInterface.js";

export class DocsView extends View {
    /** @param {string} url */
    constructor(url) {
        super("Docs");

        this.url = url;
        this.contentPosX = 0;
        this.contentPosY = 0;
        this.contentPosDragging = false;

        this.backgroundElm = new Elm().class("background").appendTo(this.elm);

        this.contentElm = new Elm().class("content").append(
            new Elm().class("title").append(
                new Elm("h1").append("Help: " + url),
                new Elm().class("closeButton").append("✕")
                    .on("click", () => userInterface.closeView(this)),
            ),
            this.frame = new Elm("iframe")
                .attribute("src", "/docs/_DocsView.html")
        ).appendTo(this.backgroundElm);


        this.docFetch = fetch("/docs/" + url + ".html");

        this.frame.elm.addEventListener("load", async () => {
            const frameDoc = this.frame.elm.contentDocument;
            new Elm("base")
                .attribute("href", "/docs/" + url)
                .appendTo(frameDoc.head);

            const text = await this.docFetch.then(e => e.text());
            frameDoc.body.innerHTML = text;
        });

        this.contentElm.on("mousedown", () => this.contentPosDragging = true);
        this.mouseUpHandler = () => this.contentPosDragging = false;
        this.contentElm.on("mousemove", e => {
            console.log(e.button);
            if (!this.contentPosDragging) { return; }
            this.contentPosX += e.movementX;
            this.contentPosY += e.movementY;
            this._updateContentElmStyle();
            this._hideBackground();
        });
    }

    _setup() {
        super._setup();
        addEventListener("mouseup", this.mouseUpHandler);

        const contentRect = this.contentElm.elm.getBoundingClientRect();
        this.contentPosX = (innerWidth - contentRect.width) / 2;
        this.contentPosY = (innerHeight - contentRect.height) / 2;
        this._updateContentElmStyle();
    }

    _setdown() {
        super._setdown();
        removeEventListener("mouseup", this.mouseUpHandler);
    }

    _updateContentElmStyle() {
        this.contentElm.attribute("style", `left: ${this.contentPosX}px; top: ${this.contentPosY}px;`);
    }

    _hideBackground() {
        this.backgroundElm.class("hideBackground");
    }
}
