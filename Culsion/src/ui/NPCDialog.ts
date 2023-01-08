import { CanvasElm } from "../engine/canvasElm/CanvasElm";
import { Elm } from "../engine/elements";
import { FlowRunner, FlowRunnerOutput } from "../engine/FlowRunner";
import { Rectangle } from "../engine/util/Rectangle";
import { World } from "../engine/World";
import { settings } from "../settings";

export class NPCDialog extends CanvasElm {
    public closed = false;

    private elm = new Elm().class("NPCDialog");

    private currentText = "";
    private atChoice = false;
    private charIndex = 0;
    private secondPerChar = 0.03;
    private timeToNext = 0;

    constructor(private dialog: FlowRunner, private rect: Rectangle) {
        super();

        this.advanceDialogHandler = this.advanceDialogHandler.bind(this);
        this.advanceDialogHandler();
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
        if (this.atChoice) { return; }
        let loopCount = 0;
        let output;
        do {
            this.dialog.runOne();
            loopCount++;
            if (loopCount > 10000) { throw new Error("Loop too long without output"); }
        } while (!(output = this.dialog.getOutput()));

        if (output.type === "default") {
            this.currentText = `${output.data[0]}:\n${output.data[1]}`;
            this.elm.clear();
            this.charIndex = 0;
        } else if (output.type === "choice") {
            const dialogChoice = new NPCDialogChoice(output.choices);
            this.world.addElm(dialogChoice);
            this.atChoice = true;
            dialogChoice.selectPromise.then(index => {
                this.dialog.inputSplitChoice(index);
                this.atChoice = false;
                this.advanceDialogHandler();
            });
        } else if (output.type === "end") {
            this.closed = true;
            this.world.removeElm(this);
        } else {
            throw new Error("Unknown output");
        }
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
