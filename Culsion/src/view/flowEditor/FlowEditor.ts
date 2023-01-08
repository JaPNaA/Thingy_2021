import { CanvasElm } from "../../engine/canvasElm/CanvasElm";
import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { FlowRunner } from "../../engine/FlowRunner";
import { Rectangle } from "../../engine/util/Rectangle";
import { World } from "../../engine/World";
import { GhostPlayer } from "../../entities/GhostPlayer";
import { resourceFetcher } from "../../resources/resourceFetcher";
import { settings } from "../../settings";

export class FlowEditor extends ParentCanvasElm {
    private treeRoot: Tree = new Tree(true);
    private currentSubtree: Tree = this.treeRoot;
    private allTrees: Tree[] = [this.treeRoot];
    private choiceQue: {
        positionIndex: number,
        tree: Tree
    }[] = [];
    private visitedMap: Map<number, Tree> = new Map();

    private ghostPlayer = new GhostPlayer();

    constructor() {
        super();

        this.addChild(this.ghostPlayer);

        resourceFetcher.fetchText("assets/testDialog.json")
            .then(text => {
                const data = JSON.parse(text);
                const runner = new FlowRunner(data);
                // this.play(runner);
                this.populateTree(runner);
                console.log(this.treeRoot);

                for (const tree of this.allTrees) {
                    this.addChild(tree);
                }
            });
    }

    public setWorld(world: World): void {
        super.setWorld(world);
        this.world.camera.follow(this.ghostPlayer.rect);
    }

    public tick() {
        super.tick();

        if (this.world.keyboard.isDown(settings.keybindings.zoomOut)) {
            this.world.camera.scale /= 1.02;
        } else if (this.world.keyboard.isDown(settings.keybindings.zoomIn)) {
            this.world.camera.scale *= 1.02;
        }
    }

    private populateTree(runner: FlowRunner) {
        this.visitedMap.set(0, this.treeRoot);

        while (true) {
            runner.runOne();
            const output = runner.getOutput();
            if (output) {
                if (output.type === "default") {
                    this.currentSubtree.data.push(output.data);
                } else if (output.type === "choice") {

                    for (let i = 0; i < output.choices.length; i++) {
                        this.choiceQue.push({
                            positionIndex: output.indexes[i],
                            tree: this.currentSubtree
                        });
                    }
                    this.fillNextOptionSubtree(runner);
                } else if (output.type === "end") {
                    if (this.choiceQue.length > 0) {
                        this.fillNextOptionSubtree(runner);
                    } else {
                        break;
                    }
                }
            }
        }

        this.arrangeTree();
    }

    private fillNextOptionSubtree(runner: FlowRunner): void {
        const item = this.choiceQue.pop();
        if (!item) { return; }

        const existingSubtree = this.visitedMap.get(item.positionIndex);
        if (existingSubtree) {
            item.tree.subtrees.push(existingSubtree);
            return this.fillNextOptionSubtree(runner);
        }

        this.currentSubtree = item.tree;
        runner.setIndex(item.positionIndex);

        const subtree = new Tree();
        this.allTrees.push(subtree);
        this.currentSubtree.subtrees.push(subtree);
        this.currentSubtree = subtree;
        this.visitedMap.set(item.positionIndex, subtree);
    }

    private arrangeTree() {
        let levelTrees = [this.treeRoot];
        let nextLevelTrees = [];

        for (let level = 0; ; level++) {
            let x = 0;
            for (const levelTree of levelTrees) {
                levelTree.rect.y = level * 100;
                levelTree.rect.x = x * 100;
                levelTree.arranged = true;
                x++;
                for (const subtree of levelTree.subtrees) {
                    if (!subtree.arranged) {
                        nextLevelTrees.push(subtree);
                    }
                }
            }

            levelTrees = nextLevelTrees;
            nextLevelTrees = [];
            if (levelTrees.length <= 0) { break; }
        }
    }
}

class Tree extends CanvasElm {
    public subtrees: Tree[] = [];
    public data: string[][] = [];

    public rect: Rectangle;
    public arranged = false;

    constructor(private isRoot = false) {
        super();
        this.rect = new Rectangle(0, 0, 64, 64);
    }

    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = this.isRoot ? "#88ffff" : "#ffffff";
        X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        X.strokeStyle = "#ff0000";
        X.beginPath();
        for (const subtree of this.subtrees) {
            X.moveTo(this.rect.centerX(), this.rect.centerY());
            X.lineTo(subtree.rect.centerX(), subtree.rect.centerY());
        }
        X.stroke();
    }
}
