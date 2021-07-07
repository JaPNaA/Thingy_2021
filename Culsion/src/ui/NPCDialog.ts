import { CanvasElm } from "../engine/CanvasElm";
import { World } from "../engine/World";
import { settings } from "../settings";

export class NPCDialog extends CanvasElm {
    private index = 0;

    constructor(private dialog: string[]) {
        super();

        this.advanceDialogHandler = this.advanceDialogHandler.bind(this);
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.keyboard.addKeydownHandler(settings.keybindings.advanceDialog, this.advanceDialogHandler);
    }

    public draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#4448";
        X.fillRect(8, 300, 500, 200);

        X.fillStyle = "#aaa";
        X.font = "24px Arial";
        X.textBaseline = "top";
        X.fillText(this.dialog[this.index] || "[...]", 16, 308);
    }

    private advanceDialogHandler() {
        this.index++;
        if (this.dialog[this.index] === undefined) {
            this.world.removeElm(this);
        }
    }

    public dispose() {
        this.world.keyboard.removeKeydownHandler(settings.keybindings.advanceDialog, this.advanceDialogHandler);
        super.dispose();
    }
}
