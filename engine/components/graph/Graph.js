import { HTMLCanvasElm } from "../../htmlCanvas/HTMLCanvasElm.js";
import { Elm } from "/utils/elements.js";

export class Graph extends HTMLCanvasElm {
    constructor() {
        super();

        this.class("graph");

        this.append(
            this.title = new Elm("h1").append("Untitled graph"),
            new Elm().attribute("style", "position: relative").append(
                this.dataCanvas = new Elm("canvas"),
                this.uiCanvas = new Elm("canvas")
                    .on("mousemove", e => this._uiCanvasMousemoveHandler(e))
            )
        );

        /** @type {CanvasRenderingContext2D} */
        this.graphX = this.dataCanvas.elm.getContext("2d");

        /** @type {CanvasRenderingContext2D} */
        this.uiX = this.uiCanvas.elm.getContext("2d");

        this.data = [];

        this.width = this.dataCanvas.elm.width;
        this.height = this.dataCanvas.elm.height;

        this.xScale = 1;
        this.yScale = 1;
        this.xOffset = 0;
        this.yOffset = 0;
        this.xRange = 0;
        this.yRange = 0;

        this.padding = 8;
    }

    setTitle(title) {
        this.title.replaceContents(title);
    }

    setData(data) {
        this.data = data.slice().sort((a, b) => a[0] - b[0]);
        console.log(this.data);
    }

    fitScaleToData() {
        const maxX = this.data[this.data.length - 1][0];
        const minX = this.data[0][0];
        const maxY = this.data.reduce((a, b) => a[1] > b[1] ? a : b)[1];
        const minY = this.data.reduce((a, b) => a[1] > b[1] ? b : a)[1];

        this.xRange = maxX - minX;
        this.yRange = maxY - minY;

        this.xScale = (this.width - this.padding * 2) / this.xRange;
        this.yScale = (this.height - this.padding * 2) / this.yRange;
        this.xOffset = minX - this.padding / this.xScale;
        this.yOffset = minY - this.padding / this.yScale;
    }

    draw() {
        this.graphX.beginPath();
        this.graphX.strokeStyle = "#ffffff";
        for (const point of this.data) {
            this.graphX.lineTo(
                (point[0] - this.xOffset) * this.xScale,
                (point[1] - this.yOffset) * this.yScale
            );
        }
        this.graphX.stroke();

        console.log(this._chooseScale(this.xRange));
        // this.graphX.fillStyle = "#888888";
        // for (let x = 0; x < this.width; x += this.xScale) {
        //     this.graphX.fillRect(x, 100, 1, 1);
        // }
    }

    /** @param {MouseEvent} e */
    _uiCanvasMousemoveHandler(e) {
        const xPos = e.layerX / this.xScale + this.xOffset;
        const closestPoint = this.data[this._getClosestIndexForX(xPos)];
        const x = (closestPoint[0] - this.xOffset) * this.xScale;
        const y = (closestPoint[1] - this.yOffset) * this.yScale;

        this.uiX.clearRect(0, 0, this.width, this.height);
        this.uiX.fillStyle = "#ff0000";
        this.uiX.beginPath();
        this.uiX.arc(
            x, y,
            2, 0, Math.PI * 2
        );
        this.uiX.fill();

        this.uiX.fillText(`(${closestPoint[0]}, ${closestPoint[1]})`, x, y);
    }

    _getYForX(x) {
        return this.data[this._getClosestIndexForX(Math.floor(x))][1];
    }

    _getClosestIndexForX(x) {
        let min = 0;
        let max1 = this.data.length;
        let middle;
        if (x < max1 && x >= min) {
            middle = x | 0;
        } else {
            middle = max1 >> 1;
        }

        while (max1 - min > 1) {
            if (this.data[middle][0] > x) {
                max1 = middle;
            } else {
                min = middle;
            }
            middle = (min + max1) >> 1;
        }

        return middle;
    }

    /** @param {number} range */
    _chooseScale(range) {
        const targetDivisions = this.dataCanvas.elm.width / 32;
        const divisionRange = range / targetDivisions;
        
        const scales = [
            10 ** Math.round(Math.log10(divisionRange)),
            5 ** Math.round(Math.log(divisionRange) / Math.log(2)),
            2 ** Math.round(Math.log2(divisionRange))
        ];

        console.log(scales);
    }
}
