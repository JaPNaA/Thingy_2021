import { vec } from "../utils/vectors.js";
import { World } from "../engine/World.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { VectorInput } from "../engine/components/vectorInput/VectorInput.js";
import { TimePath } from "../engine/components/timePath/TimePath.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { HitBox } from "../engine/canvas/HitBox.js";
import { Graph } from "../engine/components/graph/Graph.js";

const equasions = {
    /**
     * Calculate x position
     * 
     * @param {number} t - time in seconds
     * @param {number} g - gravity in m/s^2
     * @param {number} theta - initial velocity angle in radians
     * @param {number} v - initial velocity magnitude in m/s
     * @param {number} x0 - initial x position
     */
    x: (t, g, theta, v, x0) => v * Math.cos(theta) * t + x0
    ,

    /**
     * Calculate y position
     * 
     * @param {number} t - time in seconds
     * @param {number} g - gravity in m/s^2
     * @param {number} theta - initial velocity angle in radians
     * @param {number} v - initial velocity magnitude in m/s
     * @param {number} y0 - initial y position
     */
    y: (t, g, theta, v, y0) => v * Math.sin(theta) * t  - g * (t * t) / 2 + y0
};

class Ball extends CanvasElm {
    constructor() {
        super();
        
        this.pos = vec(0, 0);

        this.hovering = false;

        this.hitbox = new HitBox(this._getHitboxCorner(), vec(8, 8));
        this.hitbox.setMousemoveHandler(() => this.hovering = true);
        this.hitbox.setMouseoffHandler(() => this.hovering = false);
    }

    setup(world) {
        super.setup(world);
        world.addHitbox(this.hitbox);
    }

    draw() {
        const X = this.world.canvas.X;
        
        X.fillStyle = "#ff0000";

        X.beginPath();
        X.arc(this.pos.x, this.pos.y, 4, 0, 2 * Math.PI);
        X.closePath();
        X.fill();

        this.hitbox.setPos(this._getHitboxCorner());

        if (this.hovering) {
            X.fillText(this.pos, this.pos.x, this.pos.y);
        }
    }

    _getHitboxCorner() {
        return this.pos.subtract(vec(4, 4));
    }
}

/** @type {import("../ui/canvas/World.js").World} */
let world;

const ball = new Ball();

const vInput = new VectorInput(vec(10, -10), vec(10, 400));
const timeInput = new VectorLinearInput(vec(10, 0), vec(10, 10));
const initialPositionInput = new VectorInput(vec(100, -200), vec(200, 400));
const timePath = new TimePath();

const gravity = -9.8;

/** @param {SimulationView} simulationView */
export function start(simulationView) {
    console.log("projectileMotion");

    world = new World(simulationView);

    world.addElm(vInput);
    world.addElm(timeInput);
    world.addElm(timePath);
    world.addElm(initialPositionInput);
    world.addElm(ball);

    world.addElm(new Graph());

    resize();

    world.keyboard.addKeyDownListener("Space", () => {
        timeInput.setMagnitude(timeInput.getMagnitude() + 1);
    });
    
    vInput.onUserChange.addHandler(() => updateTimePath());
    initialPositionInput.onUserChange.addHandler(() => updateTimePath());
    updateTimePath();
}

export function resize() {
    vInput.setTailPos(vec(32, innerHeight - 32));
}

export function update() {
    const time = timeInput.magnitude / 100;

    ball.pos = getPositionAtTime(time);
    vInput.setTailPos(initialPositionInput.getVec2().add(initialPositionInput.getTailPos()));

    world.draw();
}

function updateTimePath() {
    timePath.clearNodes();

    for (let i = 0; i < 20; i += 0.1) {
        const pos = getPositionAtTime(i);
        timePath.addNode(pos.x, pos.y, i);
    }
}

function getPositionAtTime(time) {
    const velocity = vInput.getVec2();
    const initialPosition = initialPositionInput.getVec2().add(initialPositionInput.getTailPos());

    return vec(
        equasions.x(time, gravity, velocity.angle, velocity.magnitude, initialPosition.x),
        equasions.y(time, gravity, velocity.angle, velocity.magnitude, initialPosition.y)
    );
}

export function stop() {
    world.setdown();
}
