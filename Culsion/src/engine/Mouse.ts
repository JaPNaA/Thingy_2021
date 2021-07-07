export class Mouse {
    public leftDown = false;
    public rightDown = false;
    public x = 0;
    public y = 0;

    constructor() {
        this.mouseupHandler = this.mouseupHandler.bind(this);
        this.mousedownHandler = this.mousedownHandler.bind(this);
        this.mousemoveHandler = this.mousemoveHandler.bind(this);
        this.contextmenuHandler = this.contextmenuHandler.bind(this);
    }

    public _startListen() {
        addEventListener("mouseup", this.mouseupHandler);
        addEventListener("mousedown", this.mousedownHandler);
        addEventListener("mousemove", this.mousemoveHandler);
        addEventListener("contextmenu", this.contextmenuHandler);
    }

    public _stopListen() {
        removeEventListener("mouseup", this.mouseupHandler);
        removeEventListener("mousedown", this.mousedownHandler);
        removeEventListener("mousemove", this.mousemoveHandler);
        removeEventListener("contextmenu", this.contextmenuHandler);
    }

    private mouseupHandler(event: MouseEvent) {
        if (event.button === 0) {
            this.leftDown = false;
        } else if (event.button === 2) {
            this.rightDown = false;
        }
    }

    private mousedownHandler(event: MouseEvent) {
        if (event.button === 0) {
            this.leftDown = true;
        } else {
            this.rightDown = true;
        }
    }

    private mousemoveHandler(event: MouseEvent) {
        this.x = event.clientX;
        this.y = event.clientY;
    }

    private contextmenuHandler(event: Event) {
        event.preventDefault();
    }
}