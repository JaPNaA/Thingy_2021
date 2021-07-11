import { PrerenderCanvas } from "../engine/PrerenderCanvas";
import { Rectangle } from "../engine/util/Rectangle";
import { resourceFetcher } from "../resources/resourceFetcher";
import { TileMapFile } from "../resources/TileMapFile";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export class TileMap extends Entity {
    public collisionType = collisions.types.map;

    private map?: boolean[][];
    private prerender?: PrerenderCanvas;

    private readonly tileSize = 32;

    constructor() {
        super();

        resourceFetcher.fetchRaw("assets/maze.tmap").then(buffer => {
            const file = TileMapFile.fromBuffer(buffer);

            this.rect.height = file.height * this.tileSize;
            this.rect.width = file.width * this.tileSize;

            this.map = [];
            for (let y = 0; y < file.height; y++) {
                const row = [];

                for (let x = 0; x < file.width; x++) {
                    row[x] = file.mapData[y * file.width + x] ? true : false;
                }

                this.map[y] = row;
            }

            this.updatePrerender();
        });
    }

    public draw(): void {
        if (!this.prerender) { return; }
        this.prerender.drawToContext(this.world.canvas.X, this.rect.x, this.rect.y);
    }

    public updatePrerender() {
        if (!this.map) { return; }
        if (this.prerender) {
            this.prerender.resize(this.rect.width, this.rect.height);
            this.prerender.clear();
        } else {
            this.prerender = new PrerenderCanvas(this.rect.width, this.rect.height);
        }

        const X = this.prerender.X;

        X.fillStyle = "#aaa8";

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x]) {
                    X.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }

    public setBlock(x: number, y: number, block: boolean) {
        if (!this.map) { return; }

        const xIndex = Math.floor(x / this.tileSize);
        const yIndex = Math.floor(y / this.tileSize);

        if (!this.map[yIndex] || this.map[yIndex].length <= xIndex) { return; }
        this.map[yIndex][xIndex] = block;
        this.updatePrerender();
    }

    public exportTileMapFile(): TileMapFile {
        if (!this.map) { throw new Error("Map not loaded"); }
        const width = this.map[0].length;
        const height = this.map.length;
        const file = TileMapFile.create(width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                file.mapData[y * width + x] = this.map[y][x] ? 1 : 0;
            }
        }

        return file;
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
        return this.map[yIndex] && this.map[yIndex][xIndex];
    }

    private rectFromIndexes(xIndex: number, yIndex: number): Rectangle {
        return new Rectangle(xIndex * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
    }
}
