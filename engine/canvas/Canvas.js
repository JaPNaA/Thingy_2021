import { Component } from "../../utils/elements.js";

export class Canvas extends Component {
    constructor() {
        super("canvas");
        
        this.canvas = document.createElement("canvas");
        this.X = this.canvas.getContext("2d");
        this.width = 0;
        this.height = 0;

        this.elm.append(this.canvas);
    }

    resizeToScreen() {
        this.X.restore();
        this.X.resetTransform();

        const scaling = window.devicePixelRatio || 1;
        this.width = innerWidth;
        this.height = innerHeight;
        this.canvas.width = innerWidth * scaling;
        this.canvas.height = innerHeight * scaling;
        
        if (scaling != 1) {
            this.X.scale(scaling, scaling);
        }
    }
}
