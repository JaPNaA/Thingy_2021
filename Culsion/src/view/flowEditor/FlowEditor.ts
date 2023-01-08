import { CanvasElm } from "../../engine/canvasElm/CanvasElm";
import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { FlowRunner } from "../../engine/FlowRunner";
import { Rectangle } from "../../engine/util/Rectangle";
import { resourceFetcher } from "../../resources/resourceFetcher";

export class FlowEditor extends ParentCanvasElm {
    private treeRoot: Tree = new Tree(0);
    private currentSubtree: Tree = this.treeRoot;
    private allTrees: Tree[] = [this.treeRoot];
    private depths: Tree[][] = [];
    private choiceQue: {
        positionIndex: number,
        tree: Tree
    }[] = [];
    private visitedMap: Map<number, Tree> = new Map();

    constructor() {
        super();

        resourceFetcher.fetchText("assets/testDialog.json")
            .then(async (text) => {
                const data = JSON.parse(text);
                const runner = new FlowRunner(data);
                await this.populateTree(runner);
                console.log(this.treeRoot);

                for (const tree of this.allTrees) {
                    this.depths[tree.y] = this.depths[tree.y] || [];
                    tree.setX(this.depths[tree.y].length);
                    this.depths[tree.y].push(tree);
                    this.addChild(tree);
                }
            });
    }

    private async populateTree(runner: FlowRunner) {
        this.visitedMap.set(0, this.treeRoot);

        runner.setDefaultHandler((data: string[]) => this.currentSubtree.data.push(data));
        runner.setChoiceHandler((_, indexes: any[]) => {
            for (let i = 0; i < indexes.length; i++) {
                this.choiceQue.push({
                    positionIndex: indexes[i],
                    tree: this.currentSubtree
                });
            }
            this.fillNextOptionSubtree(runner);
            return -1;
        });

        runner.setEndHandler(() => {
            this.fillNextOptionSubtree(runner);
        });
        await runner.runToEnd();
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

        const subtree = new Tree(item.tree.y + 1);
        this.allTrees.push(subtree);
        this.currentSubtree.subtrees.push(subtree);
        this.currentSubtree = subtree;
        this.visitedMap.set(item.positionIndex, subtree);
    }
}

class Tree extends CanvasElm {
    public subtrees: Tree[] = [];
    public data: string[][] = [];

    public rect: Rectangle;

    constructor(public y: number) {
        super();
        this.rect = new Rectangle(
            0,
            this.y * 200,
            64, 64
        );
    }

    public setX(x: number) {
        this.rect.x = x * 200;
    }

    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#ffffff";
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
