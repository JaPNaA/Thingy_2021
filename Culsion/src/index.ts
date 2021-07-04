import { CanvasElm } from "./engine/CanvasElm";
import { World } from "./engine/World";
import { NPC } from "./entities/NPC";
import { Player } from "./entities/Player";

const world = new World();
world.addElm(new class TestElm extends CanvasElm {
    draw() {
        const X = this.world.canvas.X;
        X.fillStyle = "#fff";
        X.fillRect(performance.now() / 100, performance.now() / 100, 50, 50);
    }
});
world.addElm(new Player());
world.addElm(new NPC(50, 200));

world.appendTo(document.body);
world.keyboard.startListen();

function requanf() {
    world.draw();
    requestAnimationFrame(requanf);
}

requanf();
