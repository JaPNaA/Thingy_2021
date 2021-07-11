/**
 * Map file structure:
 * 
 * 1 byte - version number (1)
 * 4 bytes - width
 * 4 bytes - height
 * width * height bytes - map data
 * rest of file - JSON data:
 *   {
 *     blockTypes: [blockType, blockType, blockType, ...],
 *     entities: [ ... ]
 *   }
 */

export class TileMapFile {
    public version!: number;
    public width!: number;
    public height!: number;

    public mapData!: Uint8Array;
    public jsonData!: any;

    public static fromBuffer(buffer: ArrayBuffer): TileMapFile {
        const mapFile = new TileMapFile();

        const dataWalker = new DataViewWalker(buffer);
        mapFile.version = dataWalker.nextUint8();
        mapFile.width = dataWalker.nextUint32();
        mapFile.height = dataWalker.nextUint32();

        mapFile.mapData = dataWalker.nextUint8Array(mapFile.width * mapFile.height);

        const textDecoder = new TextDecoder();
        mapFile.jsonData = JSON.parse(textDecoder.decode(
            dataWalker.nextUint8Array()
        ));

        return mapFile;
    }

    public static create(width: number, height: number) {
        const mapFile = new TileMapFile();

        mapFile.version = 1;
        mapFile.width = width;
        mapFile.height = height;
        mapFile.mapData = new Uint8Array(width * height);
        mapFile.jsonData = {};

        return mapFile;
    }

    public encode() {
        const version = new Uint8Array(1);
        version[0] = this.version;

        const widthHeight = new Uint32Array(2);
        widthHeight[0] = this.width;
        widthHeight[1] = this.height;

        const jsonDataStr = JSON.stringify(this.jsonData);

        return new Blob([version, widthHeight, this.mapData, jsonDataStr]);
    }
}

class DataViewWalker {
    public currOffset: number = 0;

    private dataWalker: DataView;

    constructor(buffer: ArrayBuffer) {
        this.dataWalker = new DataView(buffer);
    }

    public nextUint8() {
        const val = this.dataWalker.getUint8(this.currOffset);
        this.currOffset += 1;
        return val;
    }

    public nextUint8Array(length?: number) {
        if (length) {
            const arr = new Uint8Array(this.dataWalker.buffer, this.currOffset, length);
            this.currOffset += length;
            return arr;
        } else {
            const arr = new Uint8Array(this.dataWalker.buffer, this.currOffset);
            this.currOffset = this.dataWalker.byteLength;
            return arr;
        }
    }

    public nextUint32() {
        const val = this.dataWalker.getUint32(this.currOffset, true);
        this.currOffset += 4;
        return val;
    }
}
