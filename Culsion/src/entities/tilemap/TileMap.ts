import { PrerenderCanvas } from "../../engine/PrerenderCanvas";
import { removeElmFromArray } from "../../engine/util/removeElmFromArray";
import { resourceFetcher } from "../../resources/resourceFetcher";
import { BlockType, TileMapFile, TileMapJoint, EntityData } from "../../resources/TileMapFile";

export class TileMap {
    public width: number;
    public height: number;

    public onTileEdit = new EventHandler<[number, number]>();
    public onJointEdit = new EventHandler();
    public onEntityEdit = new EventHandler();
    public onMajorEdit = new EventHandler();

    private map: number[][];
    private blockTypes: BlockType[];
    private joints: TileMapJoint[];
    private entities: EntityData[];
    private textures: (HTMLImageElement | PrerenderCanvas | null)[] = [];

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
        this.joints = this.file.jsonData.joints || [];
        this.entities = this.file.jsonData.entities || [];
    }

    public getBlockTexture(xIndex: number, yIndex: number): HTMLImageElement | PrerenderCanvas | null {
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
        if (
            !this.map[yIndex] ||
            this.map[yIndex].length <= xIndex ||
            this.map[yIndex][xIndex] === block
        ) { return; }

        this.map[yIndex][xIndex] = block;
        this.onTileEdit.dispatch([xIndex, yIndex]);
    }

    public getJoints(): readonly TileMapJoint[] {
        return this.joints;
    }

    public removeJoint(joint: TileMapJoint) {
        removeElmFromArray(joint, this.joints);
        this.onJointEdit.dispatch();
    }

    public addJoint(joint: TileMapJoint) {
        this.joints.push(joint);
        this.onJointEdit.dispatch();
    }

    public getJointById(id: number): TileMapJoint | undefined {
        if (!this.file.jsonData.joints) { return; }
        for (const joint of this.file.jsonData.joints) {
            if (joint.id === id) { return joint; }
        }
    }

    public getEntities(): readonly EntityData[] {
        return this.entities;
    }

    public removeEntity(entity: EntityData) {
        removeElmFromArray(entity, this.entities);
        this.onEntityEdit.dispatch();
    }

    public addEntity(entity: EntityData) {
        this.entities.push(entity);
        this.onEntityEdit.dispatch();
    }

    public getBlockTypes(): readonly BlockType[] {
        return this.blockTypes;
    }

    public addBlockType(blockType: BlockType) {
        this.blockTypes.push(blockType);
        this._loadTextures();
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

        file.jsonData = {
            blockTypes: this.blockTypes,
            joints: this.joints,
            entities: this.entities
        };

        return file;
    }

    public async _loadTextures() {
        const proms: Promise<any>[] = [];

        for (let i = 0; i < this.blockTypes.length; i++) {
            const blockType = this.blockTypes[i];
            if (!blockType.texture) {
                this.textures[i] = null;
                continue;
            }

            if (Array.isArray(blockType.texture)) {
                const layerProms = [];
                for (const layerTexture of blockType.texture) {
                    layerProms.push(resourceFetcher.fetchImg("assets/img/tile/" + layerTexture + ".png"));
                }
                proms.push(
                    Promise.all(
                        layerProms
                    ).then(imgs => {
                        const canvas = new PrerenderCanvas(imgs[0].naturalWidth, imgs[1].naturalHeight);
                        for (const img of imgs) {
                            canvas.X.drawImage(img, 0, 0);
                        }
                        this.textures[i] = canvas;
                    })
                );
            } else {
                proms.push(
                    resourceFetcher.fetchImg("assets/img/tile/" + blockType.texture + ".png")
                        .then(img => this.textures[i] = img)
                );
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
