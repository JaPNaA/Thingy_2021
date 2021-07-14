import { CanvasElm } from "../engine/canvasElm/CanvasElm";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { settings } from "../settings";

export class NPCDialog extends CanvasElm {
    public closed = false;

    private index = 0;

    constructor(private dialog: string[], private rect: Rectangle) {
        super();

        this.advanceDialogHandler = this.advanceDialogHandler.bind(this);
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.keyboard.addKeydownHandler(settings.keybindings.select, this.advanceDialogHandler);
    }

    public draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#4448";
        X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        X.fillStyle = "#aaa";
        X.font = "24px Arial";
        X.textBaseline = "top";
        const lines = this.dialog[this.index].split("\n");
        for (let y = 0; y < lines.length; y++) {
            X.fillText(lines[y] || "[...]", this.rect.x + 8, this.rect.y + 8 + y * 36);
        }
    }

    private advanceDialogHandler() {
        this.index++;
        if (this.dialog[this.index] === undefined) {
            this.closed = true;
            this.world.removeElm(this);
        }
    }

    public dispose() {
        this.world.keyboard.removeKeydownHandler(settings.keybindings.select, this.advanceDialogHandler);
        super.dispose();
    }
}
