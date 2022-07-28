import { CanvasElm } from "../engine/canvasElm/CanvasElm";
import { Elm } from "../engine/elements";
import { FlowRunner } from "../engine/FlowRunner";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { settings } from "../settings";

export class NPCDialog extends CanvasElm {
    public closed = false;

    private elm = new Elm().class("NPCDialog");

    private currentText = "";
    private textChanged = false;
    private charIndex = 0;
    private secondPerChar = 0.03;
    private timeToNext = 0;

    constructor(private dialog: FlowRunner, private rect: Rectangle) {
        super();

        this.advanceDialogHandler = this.advanceDialogHandler.bind(this);
        dialog.setDefaultHandler((data: string[]) => {
            this.currentText = `${data[0]}:\n${data[1]}`;
            this.textChanged = true;
        });
        dialog.setEndHandler(() => {
            this.closed = true;
            this.world.removeElm(this);
        });
        dialog.setChoiceHandler(async (choices: any[]) => {
            const dialogChoice = new NPCDialogChoice(choices);
            this.world.addElm(dialogChoice);
            const index = await dialogChoice.selectPromise;
            console.log(index);
            return index;
        });
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.htmlOverlay.elm.append(this.elm);
        world.keyboard.addKeydownHandler(settings.keybindings.select, this.advanceDialogHandler);
    }

    public draw() { }

    public tick() {
        if (this.charIndex >= this.currentText.length) { return; }

        this.timeToNext -= this.world.timeElapsed;

        while (this.timeToNext < 0) {
            this.elm.append(this.currentText[this.charIndex]);
            this.charIndex++;
            this.timeToNext += this.secondPerChar;
        }
    }

    private advanceDialogHandler() {
        this.textChanged = false;
        // while (!this.textChanged) {
        this.dialog.runOne();
        // }

        this.elm.clear();
        this.charIndex = 0;
    }

    public dispose() {
        this.world.keyboard.removeKeydownHandler(settings.keybindings.select, this.advanceDialogHandler);
        this.elm.remove();
        super.dispose();
    }
}

export class NPCDialogChoice extends CanvasElm {
    public closed = false;

    private elm = new Elm().class("NPCDialogChoice");
    public selectPromise: Promise<number>;

    constructor(private choices: string[]) {
        super();

        this.selectPromise = new Promise(res => {
            this.elm.append(
                new Elm("ol").withSelf(ul => {
                    for (let i = 0; i < choices.length; i++) {
                        const choice = choices[i];

                        ul.append(
                            new Elm("li").class("option")
                                .append(choice)
                                .on("click", () => {
                                    res(i);
                                    this.world.removeElm(this);
                                })
                        );
                    }
                })
            );
        })
    }

    public setWorld(world: World) {
        super.setWorld(world);

        world.htmlOverlay.elm.append(this.elm);
    }

    public draw() { }

    public dispose() {
        this.elm.remove();
        super.dispose();
    }
}
