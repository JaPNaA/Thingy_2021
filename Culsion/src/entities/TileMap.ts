import { Rectangle } from "../engine/util/Rectangle";
import { resourceFetcher } from "../resources/resourceFetcher";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export default class TileMap extends Entity {
    public collisionType = collisions.types.map;

    private map?: string[];

    private readonly tileSize = 64;

    constructor() {
        super();

        resourceFetcher.fetch("assets/map.txt").then(str => {
            this.map = str.split("\n");
            this.rect.height = this.map.length * this.tileSize;
            this.rect.width = this.map[0].length * this.tileSize;
        });
    }

    public draw(): void {
        if (!this.map) { return; }

        const X = this.world.canvas.X;

        X.fillStyle = "#aaa8";

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] !== " ") {
                    X.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }

    public getCollisionTiles(x: number, y: number): Rectangle[] | undefined {
        if (!this.map) { return; }

        const xIndex = Math.floor(x / this.tileSize);
        const yIndex = Math.floor(y / this.tileSize);

        const rects = [];

        let capturedTopLeft = false;
        let capturedTopRight = false;
        let capturedBottomLeft = false;
        let capturedBottomRight = false;

        if (this.isBlock(xIndex, yIndex)) {
            rects.push(this.rectFromIndexes(xIndex, yIndex));
        }

        if (this.isBlock(xIndex - 1, yIndex)) {
            let rect = this.rectFromIndexes(xIndex - 1, yIndex);
            if (this.isBlock(xIndex - 1, yIndex - 1)) {
                rect.y -= this.tileSize;
                rect.height += this.tileSize;
                capturedTopLeft = true;
            }
            if (this.isBlock(xIndex - 1, yIndex + 1)) {
                rect.height += this.tileSize;
                capturedBottomLeft = true;
            }
            rects.push(rect);
        }

        if (this.isBlock(xIndex + 1, yIndex)) {
            let rect = this.rectFromIndexes(xIndex + 1, yIndex);
            if (this.isBlock(xIndex + 1, yIndex - 1)) {
                rect.y -= this.tileSize;
                rect.height += this.tileSize;
                capturedTopRight = true;
            }
            if (this.isBlock(xIndex + 1, yIndex + 1)) {
                rect.height += this.tileSize;
                capturedBottomRight = true;
            }
            rects.push(rect);
        }

        if (this.isBlock(xIndex, yIndex + 1)) {
            let rect = this.rectFromIndexes(xIndex, yIndex + 1);
            if (this.isBlock(xIndex - 1, yIndex + 1)) {
                rect.x -= this.tileSize;
                rect.width += this.tileSize;
                capturedBottomLeft = true;
            }
            if (this.isBlock(xIndex + 1, yIndex + 1)) {
                rect.width += this.tileSize;
                capturedBottomRight = true;
            }
            rects.push(rect);
        }

        if (this.isBlock(xIndex, yIndex - 1)) {
            let rect = this.rectFromIndexes(xIndex, yIndex - 1);
            if (this.isBlock(xIndex - 1, yIndex - 1)) {
                rect.x -= this.tileSize;
                rect.width += this.tileSize;
                capturedTopLeft = true;
            }
            if (this.isBlock(xIndex + 1, yIndex - 1)) {
                rect.width += this.tileSize;
                capturedTopRight = true;
            }
            rects.push(rect);
        }

        if (!capturedBottomLeft && this.isBlock(xIndex - 1, yIndex + 1)) {
            rects.push(this.rectFromIndexes(xIndex - 1, yIndex + 1));
        }
        if (!capturedBottomRight && this.isBlock(xIndex + 1, yIndex + 1)) {
            rects.push(this.rectFromIndexes(xIndex + 1, yIndex + 1));
        }
        if (!capturedTopLeft && this.isBlock(xIndex - 1, yIndex - 1)) {
            rects.push(this.rectFromIndexes(xIndex - 1, yIndex - 1));
        }
        if (!capturedTopRight && this.isBlock(xIndex + 1, yIndex - 1)) {
            rects.push(this.rectFromIndexes(xIndex + 1, yIndex - 1));
        }

        return rects;
    }

    private isBlock(xIndex: number, yIndex: number) {
        if (!this.map) { return false; }
        return this.map[yIndex] && this.map[yIndex][xIndex] && this.map[yIndex][xIndex] !== ' ';
    }

    private rectFromIndexes(xIndex: number, yIndex: number): Rectangle {
        return new Rectangle(xIndex * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
    }
}
