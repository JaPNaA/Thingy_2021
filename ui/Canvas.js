export class Canvas extends Component {
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
