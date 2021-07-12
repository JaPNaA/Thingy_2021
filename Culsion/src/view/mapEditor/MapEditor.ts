import { Component, Elm } from "../../engine/elements";
import { ParentCanvasElm } from "../../engine/ParentCanvasElm";
import { World } from "../../engine/World";
import { GhostPlayer } from "../../entities/GhostPlayer";
import { TileMap } from "../../entities/TileMap";
import { resourceFetcher } from "../../resources/resourceFetcher";
import { BlockType, TileMapFile } from "../../resources/TileMapFile";
import { settings } from "../../settings";

export class MapEditor extends ParentCanvasElm {
    private tileMap?: TileMap;
    private ghostPlayer = new GhostPlayer();

    private overlay = new MapEditorOverlay();

    constructor() {
        super();

        resourceFetcher.fetchRaw("assets/" + prompt("Open map name") + ".tmap")
            .then(tileMapFile => {
                this.tileMap = new TileMap(TileMapFile.fromBuffer(tileMapFile));
                this.addChild(this.tileMap);
                this.overlay.setTileMap(this.tileMap);
            });

        this.exportMapKeyHandler = this.exportMapKeyHandler.bind(this);

        this.addChild(this.ghostPlayer);
        console.log(this);
    }

    public setWorld(world: World) {
        super.setWorld(world);
        this.world.camera.follow(this.ghostPlayer.rect);
        this.world.keyboard.addKeydownHandler(settings.keybindings.select, this.exportMapKeyHandler);
        this.world.htmlOverlay.elm.append(this.overlay);
    }

    public dispose() {
        this.world.keyboard.removeKeydownHandler(settings.keybindings.select, this.exportMapKeyHandler);
        this.overlay.elm.remove();
    }

    public tick() {
        super.tick();
        if (!this.tileMap) { return; }

        const x = this.world.camera.clientXToWorld(this.world.mouse.x);
        const y = this.world.camera.clientYToWorld(this.world.mouse.y);

        if (this.world.mouse.leftDown) {
            this.tileMap.setBlock(x, y, this.overlay.selectedBlock);
        } else if (this.world.mouse.rightDown) {
            this.tileMap.setBlock(x, y, 0);
        }

        if (this.world.keyboard.isDown(settings.keybindings.zoomOut)) {
            this.world.camera.scale /= 1.02;
        } else if (this.world.keyboard.isDown(settings.keybindings.zoomIn)) {
            this.world.camera.scale *= 1.02;
        }
    }

    public draw() {
        super.draw();

        if (!this.tileMap) { return; }
        const x = this.world.camera.clientXToWorld(this.world.mouse.x);
        const y = this.world.camera.clientYToWorld(this.world.mouse.y);
        const xIndex = Math.floor(x / this.tileMap.tileSize);
        const yIndex = Math.floor(y / this.tileMap.tileSize);

        this.world.canvas.X.fillStyle = "#ff0000";
        this.world.canvas.X.font = "12px Arial";
        this.world.canvas.X.textBaseline = "top";
        this.world.canvas.X.fillText(
            "(" + xIndex + ", " + yIndex + ")",
            xIndex * this.tileMap.tileSize, yIndex * this.tileMap.tileSize
        );
    }

    public exportMapKeyHandler() {
        if (!this.tileMap) { return; }
        const file = this.tileMap.exportTileMapFile();
        const blob = file.encode();
        this.downloadBlob(blob);
    }

    private downloadBlob(blob: Blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "MapEditorExport.tmap";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

class MapEditorOverlay extends Component {
    public selectedBlock = 1;

    private blockTypeElms: Elm<any>[] = [];

    private blockTypesElm = new Elm().class("blockTypes")
        .appendTo(this.elm);
    private canvasSizeElm = new Elm().class("canvasSize")
        .on("click", () => this.openChangeMapSizeDialog())
        .appendTo(this.elm);

    private tileMap?: TileMap;

    constructor() {
        super("MapEditorOverlay");
    }

    public setTileMap(tileMap: TileMap) {
        this.tileMap = tileMap;

        this.setBlockTypes(tileMap.getBlockTypes());
        this.setCanvasSize(tileMap.getWidth(), tileMap.getHeight());
    }

    private setBlockTypes(blockTypes: readonly BlockType[]) {
        for (let i = 0; i < blockTypes.length; i++) {
            const blockType = blockTypes[i];

            let elm: Elm<any>;

            if (blockType.texture) {
                elm = new Elm("img").attribute("src", "assets/img/tile/" + blockType.texture + ".png");
            } else {
                elm = new Elm("div");
            }

            elm.class("blockType").attribute("style", "background-color: " + blockType.color);

            elm.on("click", () => {
                this.selectBlock(i);
            });

            this.blockTypesElm.append(elm);
            this.blockTypeElms[i] = elm;
        }

        this.selectBlock(this.selectedBlock);
    }

    private selectBlock(index: number) {
        this.blockTypeElms[this.selectedBlock].removeClass("selected");
        this.selectedBlock = index;
        this.blockTypeElms[index].class("selected");
    }

    private setCanvasSize(width: number, height: number) {
        this.canvasSizeElm.replaceContents(width + "x" + height);
    }

    private openChangeMapSizeDialog() {
        if (!this.tileMap) { return; }

        //* temporary
        const newWidth = parseInt(prompt("New width")!);
        if (isNaN(newWidth)) { return; }
        const newHeight = parseInt(prompt("New height")!);
        if (isNaN(newHeight)) { return; }

        this.tileMap.resize(newWidth, newHeight);
        this.setCanvasSize(newWidth, newHeight);
    }
}
