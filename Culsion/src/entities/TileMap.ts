import { PrerenderCanvas } from "../engine/PrerenderCanvas";
import { Rectangle } from "../engine/util/Rectangle";
import { TileMapFile } from "../resources/TileMapFile";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export class TileMap extends Entity {
    public collisionType = collisions.types.map;

    private map: number[][];
    private blockTypes: BlockType[];

    private file: TileMapFile;
    private prerender: PrerenderCanvas;

    private readonly tileSize = 32;

    constructor(tileMapFile: TileMapFile) {
        super();

        this.file = tileMapFile;
        this.rect.height = tileMapFile.height * this.tileSize;
        this.rect.width = tileMapFile.width * this.tileSize;

        this.map = [];
        for (let y = 0; y < tileMapFile.height; y++) {
            const row = [];

            for (let x = 0; x < tileMapFile.width; x++) {
                row[x] = tileMapFile.mapData[y * tileMapFile.width + x];
            }

            this.map[y] = row;
        }

        this.blockTypes = tileMapFile.jsonData.blockTypes || [];

        this.prerender = new PrerenderCanvas(this.rect.width, this.rect.height);
        this.updatePrerender();
    }

    public draw(): void {
        this.prerender.drawToContext(this.world.canvas.X, this.rect.x, this.rect.y);
    }

    public updatePrerender() {
        this.prerender.resize(this.rect.width, this.rect.height);
        this.prerender.clear();

        const X = this.prerender.X;

        X.fillStyle = "#aaa8";

        for (let y = 0; y < this.file.height; y++) {
            for (let x = 0; x < this.file.width; x++) {
                X.fillStyle = this.blockTypes[this.map[y][x]].color;
                X.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    public setBlock(x: number, y: number, block: number) {
        const xIndex = Math.floor(x / this.tileSize);
        const yIndex = Math.floor(y / this.tileSize);

        if (!this.map[yIndex] || this.map[yIndex].length <= xIndex) { return; }
        this.map[yIndex][xIndex] = block;
        this.updatePrerender();
    }

    public exportTileMapFile(): TileMapFile {
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

    public getCollisionTiles(x: number, y: number): Rectangle[] {
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
        return xIndex < this.file.width && xIndex >= 0 &&
            yIndex < this.file.height && yIndex >= 0 &&
            this.blockTypes[this.map[yIndex][xIndex]].solid;
    }

    private rectFromIndexes(xIndex: number, yIndex: number): Rectangle {
        return new Rectangle(xIndex * this.tileSize, yIndex * this.tileSize, this.tileSize, this.tileSize);
    }
}

export interface BlockType {
    color: string;
    solid: boolean;
}
