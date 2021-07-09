export class Canvas {
    private canvas = document.createElement("canvas");
    public X = this.canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;

    public width = 0;
    public height = 0;

    constructor() {
        if (!this.X) { alert("Browser not supported"); throw new Error("Browser not supported: cannot get canvas context"); }
        this.resizeHandler = this.resizeHandler.bind(this);
    }

    public resizeToScreen() {
        const dpr = window.devicePixelRatio || 1;

        this.width = innerWidth;
        this.height = innerHeight;
        this.canvas.width = dpr * this.width;
        this.canvas.height = dpr * this.height;

        this.X.scale(dpr, dpr);
    }

    public _startAutoResize() {
        addEventListener("resize", this.resizeHandler);
    }

    public _stopAutoResize() {
        removeEventListener("resize", this.resizeHandler);
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.canvas);
    }

    private resizeHandler() {
        this.resizeToScreen();
    }
}
