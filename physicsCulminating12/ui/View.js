import { Component } from "../utils/elements.js";

export class View extends Component {
    constructor(viewName) {
        super("view");
        this.viewName = viewName;
        this.elm.class(viewName);
    }

    /**
     * Resize view
     * @abstract
     */
    resize() { }

    /**
     * Abstract method called after opening view
     * @abstract
     * @protected
     */
    _setup() { }

    /**
     * Abstract method called after closing view
     * @abstract
     * @protected
     */
    _setdown() { }

    /** @param {Elm} parentElm */
    open(parentElm) {
        console.log("open view", this.viewName);
        this.elm.appendTo(parentElm);
        this._setup();
    }

    close() {
        console.log("close view", this.viewName);
        this.elm.remove();
        this._setdown();
    }
}
