import { ParentCanvasElm } from "../../engine/ParentCanvasElm";
import { World } from "../../engine/World";
import { GhostPlayer } from "../../entities/GhostPlayer";
import { TileMap } from "../../entities/TileMap";
import { settings } from "../../settings";

export class MapEditor extends ParentCanvasElm {
    private tileMap = new TileMap();
    private ghostPlayer = new GhostPlayer();

    constructor() {
        super();
        this.addChild(this.tileMap);
        this.addChild(this.ghostPlayer);
        console.log(this);
    }

    public setWorld(world: World) {
        super.setWorld(world);
        this.world.camera.follow(this.ghostPlayer.rect);
    }

    public tick() {
        super.tick();

        const x = this.world.camera.clientXToWorld(this.world.mouse.x);
        const y = this.world.camera.clientYToWorld(this.world.mouse.y);

        if (this.world.mouse.leftDown) {
            this.tileMap.setBlock(x, y, true);
        } else if (this.world.mouse.rightDown) {
            this.tileMap.setBlock(x, y, false);
        }

        if (this.world.keyboard.isDown(settings.keybindings.zoomOut)) {
            this.world.camera.scale /= 1.02;
        } else if (this.world.keyboard.isDown(settings.keybindings.zoomIn)) {
            this.world.camera.scale *= 1.02;
        }
    }

    public exportMap() {
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
