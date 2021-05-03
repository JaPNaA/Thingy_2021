import { Component } from "../utils/elements.js";

export class View extends Component {
    constructor(viewName) {
        super("view");
        this.viewName = viewName;
        this.elm.class(viewName);
    }

    /** @param {Elm} parentElm */
    open(parentElm) {
        console.log("open view", this.viewName);
        this.elm.appendTo(parentElm);
    }

    close() {
        console.log("close view", this.viewName);
        this.elm.remove();
    }
}
