import { resourceFetcher } from "../resources/resourceFetcher";
import { BlockType, TileMapFile, TileMapJoint } from "../resources/TileMapFile";

export class TileMap {
    public width: number;
    public height: number;

    public onMinorEdit = new EventHandler<[number, number]>();
    public onMajorEdit = new EventHandler();

    private map: number[][];
    private blockTypes: BlockType[];
    private textures: (HTMLImageElement | null)[] = [];

    private file: TileMapFile;

    constructor(tileMapFile: TileMapFile | ArrayBuffer) {
        if (tileMapFile instanceof TileMapFile) {
            this.file = tileMapFile;
        } else {
            this.file = TileMapFile.fromBuffer(tileMapFile);
        }

        this.width = this.file.width;
        this.height = this.file.height;

        this.map = [];
        for (let y = 0; y < this.file.height; y++) {
            const row = [];

            for (let x = 0; x < this.file.width; x++) {
                row[x] = this.file.mapData[y * this.file.width + x];
            }

            this.map[y] = row;
        }

        this.blockTypes = this.file.jsonData.blockTypes || [];
    }

    public getBlockTexture(xIndex: number, yIndex: number): HTMLImageElement | null {
        return this.textures[this.map[yIndex][xIndex]];
    }

    public getBlockColor(xIndex: number, yIndex: number): string {
        return this.blockTypes[this.map[yIndex][xIndex]].color;
    }

    public isSolid(xIndex: number, yIndex: number): boolean {
        return xIndex < this.width && xIndex >= 0 &&
            yIndex < this.height && yIndex >= 0 &&
            this.blockTypes[this.map[yIndex][xIndex]].solid;
    }

    public setBlockByIndex(xIndex: number, yIndex: number, block: number): void {
        if (!this.map[yIndex] || this.map[yIndex].length <= xIndex) { return; }
        this.map[yIndex][xIndex] = block;
        this.onMinorEdit.dispatch([xIndex, yIndex]);
    }

    public getJoints(): readonly TileMapJoint[] {
        return this.file.jsonData.joints || [];
    }

    public getJointById(id: number): TileMapJoint | undefined {
        if (!this.file.jsonData.joints) { return; }
        for (const joint of this.file.jsonData.joints) {
            if (joint.id === id) { return joint; }
        }
    }

    public getBlockTypes(): readonly BlockType[] {
        return this.blockTypes;
    }

    public resizeMap(newWidth: number, newHeight: number): void {
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

        this.onMajorEdit.dispatch();
    }

    public exportToFile(): TileMapFile {
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

    public async _loadTextures() {
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


type EventHandlerFunction<T> = (data: T) => void;

class EventHandler<T = void> {
    handlers: EventHandlerFunction<T>[];

    constructor() {
        this.handlers = [];
    }

    public addHandler(handler: EventHandlerFunction<T>) {
        this.handlers.push(handler);
    }

    public removeHandler(handler: EventHandlerFunction<T>) {
        const index = this.handlers.indexOf(handler);
        if (index < 0) { throw new Error("Can't remove handler that doesn't exist"); }
        this.handlers.splice(index, 1);
    }

    public dispatch(data: T): void {
        for (const handler of this.handlers) {
            handler(data);
        }
    }
}
