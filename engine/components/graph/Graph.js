import { HTMLCanvasElm } from "../../htmlCanvas/HTMLCanvasElm.js";
import { Elm } from "/utils/elements.js";

export class Graph extends HTMLCanvasElm {
    constructor() {
        super();

        this.append(
            this.title = new Elm("h1").append("Untitled graph"),
            this.canvas = new Elm("canvas")
        );

        /** @type {CanvasRenderingContext2D} */
        this.X = this.canvas.elm.getContext("2d");

        this.data = [];

        this.width = this.canvas.elm.width;
        this.height = this.canvas.elm.height;

        this.xScale = 1;
        this.yScale = 1;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    setTitle(title) {
        this.title.replaceContents(title);
    }

    setData(data) {
        this.data = data;
    }

    fitScaleToData() {
        const maxX = this.data.reduce((a, b) => a[0] > b[0] ? a : b)[0];
        const minX = this.data.reduce((a, b) => a[0] > b[0] ? b : a)[0];
        const maxY = this.data.reduce((a, b) => a[1] > b[1] ? a : b)[1];
        const minY = this.data.reduce((a, b) => a[1] > b[1] ? b : a)[1];

        const rangeX = maxX - minX;
        const rangeY = maxY - minY;

        this.xScale = this.width / rangeX;
        this.yScale = this.height / rangeY;
        this.xOffset = minX;
        this.yOffset = minY;
    }

    draw() {
        this.X.beginPath();
        this.X.strokeStyle = "#ffffff";
        for (const point of this.data) {
            this.X.lineTo(
                (point[0] - this.xOffset) * this.xScale,
                (point[1] - this.yOffset) * this.yScale
            );
        }
        this.X.stroke();
    }
}
