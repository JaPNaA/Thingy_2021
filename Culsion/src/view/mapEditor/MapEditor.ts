import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { World } from "../../engine/World";
import { GhostPlayer } from "../../entities/GhostPlayer";
import { TileMap } from "../../entities/TileMap";
import { resourceFetcher } from "../../resources/resourceFetcher";
import { TileMapFile } from "../../resources/TileMapFile";
import { settings } from "../../settings";
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
