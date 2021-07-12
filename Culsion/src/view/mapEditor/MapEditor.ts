import { Component, Elm } from "../../engine/elements";
import { ParentCanvasElm } from "../../engine/ParentCanvasElm";
import { World } from "../../engine/World";
import { GhostPlayer } from "../../entities/GhostPlayer";
import { BlockType, TileMap } from "../../entities/TileMap";
import { resourceFetcher } from "../../resources/resourceFetcher";
import { TileMapFile } from "../../resources/TileMapFile";
import { settings } from "../../settings";

export class MapEditor extends ParentCanvasElm {
    private tileMap?: TileMap;
    private ghostPlayer = new GhostPlayer();

    private overlay = new MapEditorOverlay();

    constructor() {
        super();

        resourceFetcher.fetchRaw("assets/mazeSolved.tmap")
            .then(tileMapFile => {
                this.tileMap = new TileMap(TileMapFile.fromBuffer(tileMapFile));
                this.addChild(this.tileMap);
                this.overlay.setBlockTypes(this.tileMap.getBlockTypes());
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

    constructor() {
        super("MapEditorOverlay");
    }

    public setBlockTypes(blockTypes: readonly BlockType[]) {
        const blockTypesElm = new Elm();

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

            blockTypesElm.append(elm);
            this.blockTypeElms[i] = elm;
        }

        this.selectBlock(this.selectedBlock);

        this.elm.append(blockTypesElm);
    }

    private selectBlock(index: number) {
        this.blockTypeElms[this.selectedBlock].removeClass("selected");
        this.selectedBlock = index;
        this.blockTypeElms[index].class("selected");
    }
}
