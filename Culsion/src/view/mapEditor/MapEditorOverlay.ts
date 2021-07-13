import { Component, Elm } from "../../engine/elements";
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
        this.setCanvasSize(tileMap.getWidth(), tileMap.getHeight());
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

        this.tileMap.resize(newWidth, newHeight);
        this.setCanvasSize(newWidth, newHeight);
    }
}
