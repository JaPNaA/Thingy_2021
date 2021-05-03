class Canvas {
    constructor() {
        this.elm = document.createElement("canvas");
        this.X = this.elm.getContext("2d");
    }

    resizeToScreen() {
        const scaling = window.devicePixelRatio || 1;
        this.elm.width = innerWidth * scaling;
        this.elm.height = innerHeight * scaling;
    }
}

class UserInterface {
    constructor() {
        this.elm = document.createElement("div");
        this.canvas = new Canvas();
    }

    onResize() {
        this.canvas.resizeToScreen();
    }
}

const ui = new UserInterface();

ui.onResize();

addEventListener("resize", () => ui.onResize());

ui.canvas.X.fillRect(0, 0, 100, 100);


