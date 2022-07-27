import { CanvasElm } from "../../engine/canvasElm/CanvasElm";
import { ParentCanvasElm } from "../../engine/canvasElm/ParentCanvasElm";
import { FlowRunner } from "../../engine/FlowRunner";
import { Rectangle } from "../../engine/util/Rectangle";
import { Entity } from "../../entities/Entity";
import { resourceFetcher } from "../../resources/resourceFetcher";

export class FlowEditor extends ParentCanvasElm {
    private treeRoot: Tree = new Tree(true);
    private currentSubtree: Tree = this.treeRoot;
    private allTrees: Tree[] = [this.treeRoot];
    private choiceQue: {
        positionIndex: number,
        tree: Tree
    }[] = [];
    private visitedMap: Map<number, Tree> = new Map();

    constructor() {
        super();

        resourceFetcher.fetchText("assets/testFlow.json")
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

    private play(runner: FlowRunner) {
        runner.setDefaultHandler((data: string[]) => console.log(data));
        runner.setChoiceHandler((choices: any[]) => {
            console.log(choices);
            return parseInt(prompt() || "0");
        });
        runner.runToEnd();
    }

    private populateTree(runner: FlowRunner) {
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
        runner.runToEnd();
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
}

class Tree extends CanvasElm {
    public subtrees: Tree[] = [];
    public data: string[][] = [];

    public rect: Rectangle;

    constructor(private isRoot = false) {
        super();
        this.rect = new Rectangle(
            Math.random() * 1000,
            Math.random() * 1000,
            64, 64
        );
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
