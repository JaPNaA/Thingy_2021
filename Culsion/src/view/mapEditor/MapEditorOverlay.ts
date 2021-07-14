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

    private jointEditor = new Elm().class("jointEditor", "hidden")
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

    public setJoint(joint: TileMapJoint) {
        this.jointEditor.removeClass("hidden");
        this.jointEditor.replaceContents(
            new Elm("h3").append("Joint: "),
            new Elm().append("pos: (", joint.x, ", ", joint.y, ")"),
            new Elm().append("id: ", joint.id),
            new Elm().append("toMap: ", joint.toMap),
            new Elm().append("toId: ", joint.toId)
        );
    }

    public unsetJoint() {
        this.jointEditor.class("hidden");
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
                DialogBox.createEmptyForm({
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

class DialogBox extends Component {
    private static typeToInputType = {
        number: "number",
        string: "text",
        boolean: "checkbox"
    };

    public static async createEmptyForm<T extends { [x: string]: ("number" | "string" | "boolean") }>
        (fields: T):
        Promise<{
            [x in keyof T]:
            T[x] extends "number" ? number :
            T[x] extends "string" ? string : boolean
        }> {

        const keys = Object.keys(fields);
        //* temp: appending to document body
        const formElm = new Elm().class("dialogBox", "form").appendTo(document.body);

        const inputsMap: Map<string, InputElm> = new Map();

        for (const key of keys) {
            const input = new InputElm().setType(DialogBox.typeToInputType[fields[key]]);

            formElm.append(
                new Elm("label").class("field").append(
                    key, ": ", input
                )
            );

            inputsMap.set(key, input);
        }

        let resPromise: (x: any) => void, rejPromise: () => void;
        const promise = new Promise<any>((res, rej) => {
            resPromise = res;
            rejPromise = rej;
        })

        function trySubmit() {
            const response: { [x: string]: any } = {};

            for (const [key, input] of inputsMap) {
                if (fields[key] === "number") {
                    const val = parseFloat(input.getValue() as string);
                    if (isNaN(val)) { return; }
                    response[key] = val;
                } else if (fields[key] === "string") {
                    const val = input.getValue() as string;
                    if (!val) { return; }
                    response[key] = val;
                } else if (fields[key] === "boolean") {
                    response[key] = input.getValue() as boolean;
                }
            }

            resPromise(response);
            formElm.remove();
        }

        formElm.append(
            new Elm("button").append("Cancel")
                .on("click", () => {
                    formElm.remove();
                    rejPromise()
                }),
            new Elm("button").append("Submit")
                .on("click", trySubmit),
        );

        return promise;
    }
}
