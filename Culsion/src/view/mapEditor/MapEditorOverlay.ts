import { Component, Elm, InputElm } from "../../engine/elements";
import { TileMap } from "../../entities/TileMap";
import { BlockType, TileMapJoint } from "../../resources/TileMapFile";

export class MapEditorOverlay extends Component {
    public selectedBlock = 1;

    private blockTypeElms: Elm<any>[] = [];

    private blockTypesElm = new Elm().class("blockTypes")
        .appendTo(this.elm);

    private canvasSizeElm = new Elm().class("canvasSize")
        .on("click", () => this.openChangeMapSizeDialog())
        .appendTo(this.elm);

    private tileMap?: TileMap;

    constructor() {
        super("MapEditorOverlay");
    }

    public setTileMap(tileMap: TileMap) {
        this.tileMap = tileMap;

        this.setBlockTypes(tileMap.getBlockTypes());
        this.setCanvasSize(tileMap.width, tileMap.height);
    }

    public editJoint(joint: TileMapJoint) {
        DialogBoxForm.createFilledForm(this.elm, joint as any)
            .then(updated => {
                if (!this.tileMap) { return; }
                this.tileMap.removeJoint(joint);
                this.tileMap.addJoint(updated);
            });
    }

    private setBlockTypes(blockTypes: readonly BlockType[]) {
        this.blockTypesElm.clear();

        for (let i = 0; i < blockTypes.length; i++) {
            const blockType = blockTypes[i];

            let elm: Elm<any>;

            if (blockType.texture) {
                elm = new Elm("img").attribute("src", "assets/img/tile/" + blockType.texture + ".png");
            } else {
                elm = new Elm("div");
            }

            elm.class("blockType").attribute("style", "background-color: " + blockType.color);

            elm.on("click", () => {
                this.selectBlock(i);
            });

            this.blockTypesElm.append(elm);
            this.blockTypeElms[i] = elm;
        }

        this.blockTypesElm.append(
            new Elm("div").append("+").on("click", () => {
                DialogBoxForm.createEmptyForm(this.elm, {
                    color: "string",
                    texture: "string",
                    solid: "boolean"
                }).then(response => {
                    if (!this.tileMap) { return; }
                    this.tileMap.addBlockType(response);
                    this.setBlockTypes(this.tileMap.getBlockTypes());
                });
            })
        )

        this.selectBlock(this.selectedBlock);
    }

    private selectBlock(index: number) {
        this.blockTypeElms[this.selectedBlock].removeClass("selected");
        this.selectedBlock = index;
        this.blockTypeElms[index].class("selected");
    }

    private setCanvasSize(width: number, height: number) {
        this.canvasSizeElm.replaceContents(width + "x" + height);
    }

    private openChangeMapSizeDialog() {
        if (!this.tileMap) { return; }

        //* temporary
        const newWidth = parseInt(prompt("New width")!);
        if (isNaN(newWidth)) { return; }
        const newHeight = parseInt(prompt("New height")!);
        if (isNaN(newHeight)) { return; }

        this.tileMap.resizeMap(newWidth, newHeight);
        this.setCanvasSize(newWidth, newHeight);
    }
}

type InputOptions = { type: string, optional?: boolean, default?: any };

class DialogBoxForm extends Component {
    public reponsePromise: Promise<any>;

    private static typeToInputType = {
        number: "number",
        string: "text",
        boolean: "checkbox"
    };

    private inputsElm = new Elm();

    private inputsMap: Map<string, [InputElm, InputOptions]> = new Map();
    private resPromise!: (x: any) => void;
    private rejPromise!: (x: string) => void;

    constructor() {
        super("dialogBox");
        this.elm.class("dialogBox", "form");

        this.elm.append(
            this.inputsElm,
            new Elm().append(
                new Elm("button").append("Cancel")
                    .on("click", () => {
                        this.elm.remove();
                        this.rejPromise("Canceled by user");
                    }),
                new Elm("button").append("Submit")
                    .on("click", () => {
                        this.resPromise(this.getResponse());
                        this.elm.remove();
                    })
            )
        )

        this.reponsePromise = new Promise<any>((res, rej) => {
            this.resPromise = res;
            this.rejPromise = rej;
        });
    }

    public static async createEmptyForm<T extends { [x: string]: ("number" | "string" | "boolean") }>
        (parent: Elm, fields: T): Promise<{
            [x in keyof T]:
            T[x] extends "number" ? number :
            T[x] extends "string" ? string : boolean
        }> {

        const keys = Object.keys(fields);
        const dialogBoxForm = new DialogBoxForm();

        for (const key of keys) {
            dialogBoxForm.addInput(key, {
                type: DialogBoxForm.typeToInputType[fields[key]]
            });
        }

        dialogBoxForm.appendTo(parent);

        return dialogBoxForm.reponsePromise;
    }

    public static async createFilledForm<T extends { [x: string]: number | string | boolean }>
        (parent: Elm, fields: T): Promise<T> {

        const keys = Object.keys(fields);
        const dialogBoxForm = new DialogBoxForm();

        for (const key of keys) {
            dialogBoxForm.addInput(key, {
                type: typeof fields[key],
                default: fields[key]
            });
        }

        dialogBoxForm.appendTo(parent);

        return dialogBoxForm.reponsePromise;
    }

    public addInput(key: string, options: InputOptions) {
        const input = new InputElm().setType(options.type);
        if (options.default !== undefined) {
            input.setValue(options.default);
        }

        this.inputsElm.append(
            new Elm("label").class("field").append(
                key, ": ", input
            )
        );

        this.inputsMap.set(key, [input, options]);
    }

    private getResponse(): any {
        const response: { [x: string]: any } = {};

        for (const [key, [input, options]] of this.inputsMap) {
            if (options.type === "number") {
                const val = parseFloat(input.getValue() as string);
                if (isNaN(val)) { return; }
                response[key] = val;
            } else if (options.type === "string") {
                const val = input.getValue() as string;
                if (!val) { return; }
                response[key] = val;
            } else if (options.type === "boolean") {
                response[key] = input.getValue() as boolean;
            }
        }

        return response;
    }
}
