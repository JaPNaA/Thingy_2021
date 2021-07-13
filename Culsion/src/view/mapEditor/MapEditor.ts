import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { World } from "../../engine/World";
import { GhostPlayer } from "../../entities/GhostPlayer";
import { TileMap } from "../../entities/TileMap";
import { resourceFetcher } from "../../resources/resourceFetcher";
import { TileMapFile } from "../../resources/TileMapFile";
import { settings } from "../../settings";
import { MapEditorEntityJointLayer } from "./MapEditorEntityJointLayer";
import { MapEditorMapLayer } from "./MapEditorMapLayer";
import { MapEditorOverlay } from "./MapEditorOverlay";

export class MapEditor extends ParentCanvasElm {
    private tileMap?: TileMap;
    private ghostPlayer = new GhostPlayer();

    private overlay = new MapEditorOverlay();

    constructor() {
        super();

        resourceFetcher.fetchRaw("assets/" + prompt("Open map name") + ".tmap")
            .then(tileMapFile => {
                this.tileMap = new TileMap(TileMapFile.fromBuffer(tileMapFile));
                this.overlay.setTileMap(this.tileMap);

                const mapLayer = new MapEditorMapLayer(this.tileMap);
                const entityJointLayer = new MapEditorEntityJointLayer(this.tileMap);
                this.addChild(mapLayer);
                this.addChild(entityJointLayer);
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

        if (this.world.keyboard.isDown(settings.keybindings.zoomOut)) {
            this.world.camera.scale /= 1.02;
        } else if (this.world.keyboard.isDown(settings.keybindings.zoomIn)) {
            this.world.camera.scale *= 1.02;
        }
    }

    public draw() {
        super.draw();
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
