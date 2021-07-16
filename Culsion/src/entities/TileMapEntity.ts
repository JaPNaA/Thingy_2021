import { PrerenderCanvas } from "../engine/PrerenderCanvas";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { collisions } from "./collisions";
import { Entity } from "./Entity";
import { TileMap } from "./TileMap";

export class TileMapEntity extends Entity {
    public static readonly tileSize = 48;
    public collisionType = collisions.types.map;
    public readonly tileSize = TileMapEntity.tileSize;

    public data: TileMap;

    private prerender: PrerenderCanvas;

    private readonly tileTextureSize = 12;

    constructor(tileMap: TileMap) {
        super();

        this.data = tileMap;

        this.prerender = new PrerenderCanvas(this.rect.width, this.rect.height);

        this.data.onTileEdit.addHandler(pos => this.updatePrerenderTile(pos[0], pos[1]));
        this.data.onMajorEdit.addHandler(() => this.updatePrerender());

        this.data._loadTextures().then(() => this.updatePrerender());
    }

    public setWorld(world: World) {
        super.setWorld(world);
    }

    public draw(): void {
        this.world.canvas.X.imageSmoothingEnabled = false;
        this.prerender.drawToContext(this.world.canvas.X, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    public updatePrerender() {
        this.rect.width = this.data.width * this.tileSize;
        this.rect.height = this.data.height * this.tileSize;
        this.prerender.resize(this.data.width * this.tileTextureSize, this.data.height * this.tileTextureSize);
        this.prerender.clear();

        const X = this.prerender.X;
        X.imageSmoothingEnabled = false;

        for (let y = 0; y < this.data.height; y++) {
            for (let x = 0; x < this.data.width; x++) {
                const texture = this.data.getBlockTexture(x, y);
                if (texture) {
                    X.drawImage(
                        texture,
                        x * this.tileTextureSize, y * this.tileTextureSize,
                    );
                } else {
                    X.fillStyle = this.data.getBlockColor(x, y);
                    X.fillRect(x * this.tileTextureSize, y * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
                }
            }
        }
    }

    public updatePrerenderTile(xIndex: number, yIndex: number) {
        const X = this.prerender.X;
        X.imageSmoothingEnabled = false;

        const texture = this.data.getBlockTexture(xIndex, yIndex);
        if (texture) {
            X.drawImage(
                texture,
                xIndex * this.tileTextureSize, yIndex * this.tileTextureSize,
            );
        } else {
            X.clearRect(xIndex * this.tileTextureSize, yIndex * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
            X.fillStyle = this.data.getBlockColor(xIndex, yIndex);
            X.fillRect(xIndex * this.tileTextureSize, yIndex * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
        }
    }

    public setBlock(x: number, y: number, block: number) {
        const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
        const yIndex = Math.floor((y - this.rect.y) / this.tileSize);
        this.data.setBlockByIndex(xIndex, yIndex, block);
    }

    public getCollisionTiles(x: number, y: number): Rectangle[] {
        const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
        const yIndex = Math.floor((y - this.rect.y) / this.tileSize);

        const rects = [];

        let capturedTopLeft = false;
        let capturedTopRight = false;
        let capturedBottomLeft = false;
        let capturedBottomRight = false;

        if (this.data.isSolid(xIndex, yIndex)) {
            rects.push(this.rectFromIndexes(xIndex, yIndex));
        }

        if (this.data.isSolid(xIndex - 1, yIndex)) {
            let rect = this.rectFromIndexes(xIndex - 1, yIndex);
            if (this.data.isSolid(xIndex - 1, yIndex - 1)) {
                rect.y -= this.tileSize;
                rect.height += this.tileSize;
                capturedTopLeft = true;
            }
            if (this.data.isSolid(xIndex - 1, yIndex + 1)) {
                rect.height += this.tileSize;
                capturedBottomLeft = true;
            }
            rects.push(rect);
        }

        if (this.data.isSolid(xIndex + 1, yIndex)) {
            let rect = this.rectFromIndexes(xIndex + 1, yIndex);
            if (this.data.isSolid(xIndex + 1, yIndex - 1)) {
                rect.y -= this.tileSize;
                rect.height += this.tileSize;
                capturedTopRight = true;
            }
            if (this.data.isSolid(xIndex + 1, yIndex + 1)) {
                rect.height += this.tileSize;
                capturedBottomRight = true;
            }
            rects.push(rect);
        }

        if (this.data.isSolid(xIndex, yIndex + 1)) {
            let rect = this.rectFromIndexes(xIndex, yIndex + 1);
            if (this.data.isSolid(xIndex - 1, yIndex + 1)) {
                rect.x -= this.tileSize;
                rect.width += this.tileSize;
                capturedBottomLeft = true;
            }
            if (this.data.isSolid(xIndex + 1, yIndex + 1)) {
                rect.width += this.tileSize;
                capturedBottomRight = true;
            }
            rects.push(rect);
        }

        if (this.data.isSolid(xIndex, yIndex - 1)) {
            let rect = this.rectFromIndexes(xIndex, yIndex - 1);
            if (this.data.isSolid(xIndex - 1, yIndex - 1)) {
                rect.x -= this.tileSize;
                rect.width += this.tileSize;
                capturedTopLeft = true;
            }
            if (this.data.isSolid(xIndex + 1, yIndex - 1)) {
                rect.width += this.tileSize;
                capturedTopRight = true;
            }
            rects.push(rect);
        }

        if (!capturedBottomLeft && this.data.isSolid(xIndex - 1, yIndex + 1)) {
            rects.push(this.rectFromIndexes(xIndex - 1, yIndex + 1));
        }
        if (!capturedBottomRight && this.data.isSolid(xIndex + 1, yIndex + 1)) {
            rects.push(this.rectFromIndexes(xIndex + 1, yIndex + 1));
        }
        if (!capturedTopLeft && this.data.isSolid(xIndex - 1, yIndex - 1)) {
            rects.push(this.rectFromIndexes(xIndex - 1, yIndex - 1));
        }
        if (!capturedTopRight && this.data.isSolid(xIndex + 1, yIndex - 1)) {
            rects.push(this.rectFromIndexes(xIndex + 1, yIndex - 1));
        }

        return rects;
    }

    private rectFromIndexes(xIndex: number, yIndex: number): Rectangle {
        return new Rectangle(xIndex * this.tileSize + this.rect.x, yIndex * this.tileSize + this.rect.y, this.tileSize, this.tileSize);
    }
}
