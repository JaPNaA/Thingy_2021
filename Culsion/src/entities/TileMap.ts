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

        if (this.isBlock(xIndex, yIndex)) {
            rects.push(new Rectangle(xIndex * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize));
        }

        if (this.isBlock(xIndex - 1, yIndex)) {
            let rect = new Rectangle((xIndex - 1) * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
            if (this.isBlock(xIndex - 1, yIndex - 1)) {
                rect.y -= this.tileSize;
                rect.height += this.tileSize;
            }
            if (this.isBlock(xIndex - 1, yIndex + 1)) {
                rect.height += this.tileSize;
            }
            rects.push(rect);
        }

        if (this.isBlock(xIndex + 1, yIndex)) {
            let rect = new Rectangle((xIndex + 1) * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
            if (this.isBlock(xIndex + 1, yIndex - 1)) {
                rect.y -= this.tileSize;
                rect.height += this.tileSize;
            }
            if (this.isBlock(xIndex + 1, yIndex + 1)) {
                rect.height += this.tileSize;
            }
            rects.push(rect);
        }

        if (this.isBlock(xIndex, yIndex + 1)) {
            let rect = new Rectangle(xIndex * this.tileSize, (yIndex + 1) * this.tileSize, this.tileSize, this.tileSize);
            if (this.isBlock(xIndex - 1, yIndex + 1)) {
                rect.x -= this.tileSize;
                rect.width += this.tileSize;
            }
            if (this.isBlock(xIndex + 1, yIndex + 1)) {
                rect.width += this.tileSize;
            }
            rects.push(rect);
        }

        if (this.isBlock(xIndex, yIndex - 1)) {
            let rect = new Rectangle(xIndex * this.tileSize, (yIndex - 1) * this.tileSize, this.tileSize, this.tileSize);
            if (this.isBlock(xIndex - 1, yIndex - 1)) {
                rect.x -= this.tileSize;
                rect.width += this.tileSize;
            }
            if (this.isBlock(xIndex + 1, yIndex - 1)) {
                rect.width += this.tileSize;
            }
            rects.push(rect);
        }

        return rects;
    }

    private isBlock(xIndex: number, yIndex: number) {
        if (!this.map) { return false; }
        return this.map[yIndex] && this.map[yIndex][xIndex] && this.map[yIndex][xIndex] !== ' ';
    }
}
