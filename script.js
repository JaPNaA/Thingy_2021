import { Component } from "./utils/elements.js";
import { equasions } from "./equasions.js";

class Canvas extends Component {
    constructor() {
        super("canvas");
        
        this.canvas = document.createElement("canvas");
        this.X = this.canvas.getContext("2d");

        this.elm.append(this.canvas);
    }

    resizeToScreen() {
        const scaling = window.devicePixelRatio || 1;
        this.canvas.width = innerWidth * scaling;
        this.canvas.height = innerHeight * scaling;
    }
}

class UserInterface extends Component {
    constructor() {
        super("userInterface");
        
        this.elm.append(
            this.canvas = new Canvas()
        );
    }

    onResize() {
        this.canvas.resizeToScreen();
    }
}

const ui = new UserInterface();

ui.elm.appendTo(document.body);
ui.onResize();

addEventListener("resize", () => ui.onResize());

ui.canvas.X.fillRect(0, 0, 100, 100);


console.log(equasions);
