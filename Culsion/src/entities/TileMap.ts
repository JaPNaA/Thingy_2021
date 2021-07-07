import { resourceFetcher } from "../resources/resourceFetcher";
import { collisions } from "./collisions";
import { Entity } from "./Entity";

export default class TileMap extends Entity {
    public collisionType = collisions.types.map;

    private map?: string[];

    private readonly tileSize = 64;

    constructor() {
        super();

        resourceFetcher.fetch("assets/map.txt").then(str => {
            this.map = str.split("\n");
            this.height = this.map.length * this.tileSize;
            this.width = this.map[0].length * this.tileSize;
        });
    }

    draw(): void {
        if (!this.map) { return; }

        const X = this.world.canvas.X;

        X.fillStyle = "#aaa8";

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] !== " ") {
                    X.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }
}
