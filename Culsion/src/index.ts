import { World } from "./engine/World";
import { registerCollisions } from "./entities/collisions";
import { GameView } from "./view/GameView";
import { MapEditor } from "./view/mapEditor/MapEditor";

const world = new World();

registerCollisions(world.collisionSystem.reactions);

world.appendTo(document.body);
world.startListen();

if (location.hash == "#mapEditor") {
    world.addElm(new MapEditor());
} else {
    world.addElm(new GameView());
}

function requanf() {
    world.draw();
    requestAnimationFrame(requanf);
}

requanf();

history.scrollRestoration = "manual";
