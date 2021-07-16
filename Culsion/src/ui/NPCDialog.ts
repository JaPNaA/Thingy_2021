import { CanvasElm } from "../engine/canvasElm/CanvasElm";
import { Elm } from "../engine/elements";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { settings } from "../settings";

export class NPCDialog extends CanvasElm {
    public closed = false;

    private elm = new Elm().class("NPCDialog");

    private index = 0;
    private charIndex = 0;
    private secondPerChar = 0.03;
    private timeToNext = 0;

    constructor(private dialog: string[], private rect: Rectangle) {
        super();

        this.advanceDialogHandler = this.advanceDialogHandler.bind(this);
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.htmlOverlay.elm.append(this.elm);
        world.keyboard.addKeydownHandler(settings.keybindings.select, this.advanceDialogHandler);
    }

    public draw() { }

    public tick() {
        if (this.charIndex >= this.dialog[this.index].length) { return; }

        this.timeToNext -= this.world.timeElapsed;

        while (this.timeToNext < 0) {
            this.elm.append(this.dialog[this.index][this.charIndex]);
            this.charIndex++;
            this.timeToNext += this.secondPerChar;
        }
    }

    private advanceDialogHandler() {
        this.index++;
        if (this.dialog[this.index] === undefined) {
            this.closed = true;
            this.world.removeElm(this);
        } else {
            this.elm.clear();
            this.charIndex = 0;
        }
    }

    public dispose() {
        this.world.keyboard.removeKeydownHandler(settings.keybindings.select, this.advanceDialogHandler);
        this.elm.remove();
        super.dispose();
    }
}
