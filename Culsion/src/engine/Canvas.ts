export class Canvas {
    private canvas = document.createElement("canvas");
    public X = this.canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;

    public width = 0;
    public height = 0;

    constructor() {
        if (!this.X) { alert("Browser not supported"); throw new Error("Browser not supported: cannot get canvas context"); }
    }

    public resizeToScreen() {
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = this.width = dpr * innerWidth;
        this.canvas.height = this.height = dpr * innerHeight;

        this.X.scale(dpr, dpr);
    }

    public appendTo(parent: HTMLElement) {
        parent.appendChild(this.canvas);
    }
}
