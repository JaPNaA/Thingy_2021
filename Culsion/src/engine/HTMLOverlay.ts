import { Component } from "./elements";

export class HTMLOverlay extends Component {
    constructor() {
        super("HTMLOverlay");

        this.elm.on("mousedown", e => e.stopPropagation());
    }
}
