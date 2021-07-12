import { PrerenderCanvas } from "../engine/PrerenderCanvas";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { resourceFetcher } from "../resources/resourceFetcher";
import { BlockType, TileMapFile, TileMapJoint } from "../resources/TileMapFile";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export class TileMap extends Entity {
    public collisionType = collisions.types.map;
    public readonly tileSize = 48;

    private map: number[][];
    private blockTypes: BlockType[];
    private textures: (HTMLImageElement | null)[] = [];
    private width: number;
    private height: number;

    private file: TileMapFile;
    private prerender: PrerenderCanvas;

    private readonly tileTextureSize = 12;

    constructor(tileMapFile: TileMapFile) {
        super();

        this.file = tileMapFile;
        this.width = tileMapFile.width;
        this.height = tileMapFile.height;
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

        this.loadTextures().then(() => this.updatePrerender());
    }

    public setWorld(world: World) {
        super.setWorld(world);

        if (this.file.jsonData.joints) {
            for (const joint1 of this.file.jsonData.joints) {
                //* temporary -- toMap should always be defined
                if (!joint1.toMap) { return; }

                resourceFetcher.fetchRaw("assets/" + joint1.toMap + ".tmap")
                    .then(buffer => {
                        const tileMap = new TileMap(TileMapFile.fromBuffer(buffer));
                        const joint2 = tileMap.getJointById(joint1.toId);
                        if (!joint2) { throw new Error("Failed to join joints -- could not find target joint."); }

                        const dx = (joint1.x - joint2.x) * this.tileSize;
                        const dy = (joint1.y - joint2.y) * this.tileSize;

                        tileMap.rect.x += dx;
                        tileMap.rect.y += dy;

                        this.world.addElm(tileMap, 0);
                    });
            }
        }
    }

    protected getJointById(id: number): TileMapJoint | undefined {
        if (!this.file.jsonData.joints) { return; }
        for (const joint of this.file.jsonData.joints) {
            if (joint.id === id) { return joint; }
        }
    }

    public draw(): void {
        this.world.canvas.X.imageSmoothingEnabled = false;
        this.prerender.drawToContext(this.world.canvas.X, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    public updatePrerender() {
        this.prerender.resize(this.width * this.tileTextureSize, this.height * this.tileTextureSize);
        this.prerender.clear();

        const X = this.prerender.X;
        X.imageSmoothingEnabled = false;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const blockTypeIndex = this.map[y][x];
                if (this.textures[blockTypeIndex]) {
                    X.drawImage(
                        this.textures[blockTypeIndex]!,
                        x * this.tileTextureSize, y * this.tileTextureSize,
                    );
                } else {
                    X.fillStyle = this.blockTypes[blockTypeIndex].color;
                    X.fillRect(x * this.tileTextureSize, y * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
                }
            }
        }
    }

    public updatePrerenderTile(xIndex: number, yIndex: number) {
        const X = this.prerender.X;
        X.imageSmoothingEnabled = false;

        const blockTypeIndex = this.map[yIndex][xIndex];
        if (this.textures[blockTypeIndex]) {
            X.drawImage(
                this.textures[blockTypeIndex]!,
                xIndex * this.tileTextureSize, yIndex * this.tileTextureSize,
            );
        } else {
            X.fillStyle = this.blockTypes[blockTypeIndex].color;
            X.fillRect(xIndex * this.tileTextureSize, yIndex * this.tileTextureSize, this.tileTextureSize, this.tileTextureSize);
        }
    }

    public setBlock(x: number, y: number, block: number) {
        const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
        const yIndex = Math.floor((y - this.rect.y) / this.tileSize);

        if (!this.map[yIndex] || this.map[yIndex].length <= xIndex) { return; }
        this.map[yIndex][xIndex] = block;
        this.updatePrerenderTile(xIndex, yIndex);
    }

    public getBlockTypes(): readonly BlockType[] {
        return this.blockTypes;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public resize(newWidth: number, newHeight: number) {
        for (let y = 0; y < this.height; y++) {
            for (let x = this.width; x < newWidth; x++) {
                this.map[y][x] = 0;
            }
            this.map[y].length = newWidth;
        }
        for (let y = this.height; y < newHeight; y++) {
            const newRow = [];
            for (let x = 0; x < newWidth; x++) {
                newRow[x] = 0;
            }
            this.map[y] = newRow;
        }
        this.map.length = newHeight;

        this.width = newWidth;
        this.height = newHeight;
        this.rect.width = this.width * this.tileSize;
        this.rect.height = this.height * this.tileSize;
        this.updatePrerender();
    }

    public exportTileMapFile(): TileMapFile {
        const width = this.map[0].length;
        const height = this.map.length;
        const file = TileMapFile.create(width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                file.mapData[y * width + x] = this.map[y][x];
            }
        }

        file.jsonData = this.file.jsonData;

        return file;
    }

    public getCollisionTiles(x: number, y: number): Rectangle[] {
        const xIndex = Math.floor((x - this.rect.x) / this.tileSize);
        const yIndex = Math.floor((y - this.rect.y) / this.tileSize);

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
        return xIndex < this.width && xIndex >= 0 &&
            yIndex < this.height && yIndex >= 0 &&
            this.blockTypes[this.map[yIndex][xIndex]].solid;
    }

    private rectFromIndexes(xIndex: number, yIndex: number): Rectangle {
        return new Rectangle(xIndex * this.tileSize + this.rect.x, yIndex * this.tileSize + this.rect.y, this.tileSize, this.tileSize);
    }

    private async loadTextures() {
        const proms = [];

        for (let i = 0; i < this.blockTypes.length; i++) {
            const blockType = this.blockTypes[i];
            if (blockType.texture) {
                proms.push(
                    resourceFetcher.fetchImg("assets/img/tile/" + blockType.texture + ".png")
                        .then(img => this.textures[i] = img)
                );
            } else {
                this.textures[i] = null;
            }
        }

        await Promise.all(proms);
    }
}
