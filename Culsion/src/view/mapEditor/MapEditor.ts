import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { World } from "../../engine/World";
import { GhostPlayer } from "../../entities/GhostPlayer";
import { TileMapEntity } from "../../entities/TileMapEntity";
import { resourceFetcher } from "../../resources/resourceFetcher";
import { settings } from "../../settings";
import { MapEditorEntityJointLayer } from "./MapEditorEntityJointLayer";
import { MapEditorMapLayer } from "./MapEditorMapLayer";
import { MapEditorOverlay } from "./MapEditorOverlay";

export class MapEditor extends ParentCanvasElm {
    private tileMap?: TileMapEntity;
    private ghostPlayer = new GhostPlayer();

    private overlay = new MapEditorOverlay();
    private editorMapLayer?: MapEditorMapLayer;
    private editorEntityJointLayer?: MapEditorEntityJointLayer;

    constructor() {
        super();

        resourceFetcher.fetchRaw("assets/" + prompt("Open map name") + ".tmap")
            .then(tileMapFile => {
                this.tileMap = new TileMapEntity(tileMapFile);
                this.overlay.setTileMap(this.tileMap.data);

                this.editorMapLayer = new MapEditorMapLayer(this.tileMap, this.overlay);
                this.editorEntityJointLayer = new MapEditorEntityJointLayer(this.tileMap, this.overlay);
                this.addChild(this.editorMapLayer);
                this.addChild(this.editorEntityJointLayer);
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
        this.editorMapLayer?.dispose();
        this.editorEntityJointLayer?.dispose();
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
        const blob = this.tileMap.data.exportToFile().encode();
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
