import { CanvasElm } from "../engine/CanvasElm";
import { ParentCanvasElm } from "../engine/ParentCanvasElm";
import { NPCWithDialog } from "../entities/NPCWithDialog";
import { Player } from "../entities/Player";
import { TileMap } from "../entities/TileMap";

export class GameView extends ParentCanvasElm {
    constructor() {
        super();

        this.addChild(new class TestElm extends CanvasElm {
            draw() {
                const X = this.world.canvas.X;
                X.fillStyle = "#fff";
                X.fillRect(performance.now() / 100, performance.now() / 100, 50, 50);
            }
        });

        this.addChild(new Player());
        this.addChild(new NPCWithDialog(70, 600));
        this.addChild(new NPCWithDialog(94, 624));
        this.addChild(new TileMap());
    }
}
