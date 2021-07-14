import { CanvasElm } from "./engine/canvasElm/CanvasElm";
import { World } from "./engine/World";
import { registerCollisions } from "./entities/collisions";
import { GameView } from "./view/GameView";
import { MapEditor } from "./view/mapEditor/MapEditor";

const world = new World();

registerCollisions(world.collisionSystem.reactions);

world.appendTo(document.body);
world.startListen();

let currViewElm: CanvasElm | undefined;

function navigateByHash() {
    if (currViewElm) {
        world.removeElm(currViewElm);
    }

    if (location.hash == "#mapEditor") {
        currViewElm = new MapEditor();
    } else {
        currViewElm = new GameView();
    }
    world.addElm(currViewElm);
}

function requanf() {
    world.draw();
    requestAnimationFrame(requanf);
}

navigateByHash();
requanf();

addEventListener("hashchange", function () {
    navigateByHash();
});

// @ts-ignore -- debug
window.world = world;

history.scrollRestoration = "manual";
