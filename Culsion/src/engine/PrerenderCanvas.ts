export class PrerenderCanvas {
    private canvas = document.createElement("canvas");
    public X = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    public width!: number;
    public height!: number;

    constructor(width: number, height: number) {
        this.resize(width, height);
    }

    public drawToContext(X: CanvasRenderingContext2D, x: number, y: number) {
        X.drawImage(this.canvas, x, y, this.width, this.height);
    }

    public resize(width: number, height: number) {
        const dpr = window.devicePixelRatio || 1;

        this.width = width;
        this.height = height;

        this.canvas.width = dpr * width;
        this.canvas.height = dpr * height;

        this.X.resetTransform();
        this.X.scale(dpr, dpr);
    }

    public clear() {
        this.X.clearRect(0, 0, this.width, this.height);
    }
}
