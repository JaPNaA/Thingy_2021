import { World } from "../engine/World.js";
import { Variable, Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";
import { VectorArrow } from "../engine/components/vectorArrow/VectorArrow.js";

const expressionSolver = new ExpressionSolver({
    variables: ["v", ["r", 100], ["m", 0.1], ["q", 0.1], ["B", 0.5]],
    expression: vars => new Expression(
        "subtract",
        new Expression("multiply",
            vars.q, vars.B
        ),
        new Expression("divide",
            new Expression("multiply", vars.v, vars.m),
            vars.r
        )
    )
});


class OrbitBall extends CanvasElm {
    constructor() {
        super();
        this.radius = 1;
        this.pos = vec(0, 0);
        this.angle = 0;

        this.accelerationArrow = new VectorArrow();
    }

    setup(world) {
        super.setup(world);
        this.world.addElm(this.accelerationArrow);
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        X.strokeStyle = "#ffffff";
        X.fillStyle = "#ff0000";
        X.lineWidth = 1 / this.world.camera.zoom;

        X.beginPath();
        X.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        X.stroke();

        const ballPosRel = Vec2.fromPolar(this.radius, this.angle);
        const ballPos = ballPosRel.add(this.pos);

        X.beginPath();
        X.arc(ballPos.x, ballPos.y, 4 / this.world.camera.zoom, 0, Math.PI * 2);
        X.fill();

        const acceleration = expressionSolver.variables.v.eval() ** 2 / expressionSolver.variables.r.eval();

        const accelerationVecHead = ballPosRel.withMagnitude(-acceleration);
        this.accelerationArrow.setTail(ballPosRel.add(this.pos));
        this.accelerationArrow.setValue(accelerationVecHead);
    }
}

const orbitBall = new OrbitBall();

let world;

export function start(simulationView) {
    world = new World(simulationView);
    world.addElm(orbitBall);
    expressionSolver.addFormToWorld(world);

    resize();
}

export function update(timeElapsed) {
    const radius = expressionSolver.variables.r.eval();
    orbitBall.radius = radius;

    const angularSpeed = expressionSolver.variables.v.eval() / radius;
    orbitBall.angle += angularSpeed * timeElapsed;

    world.draw();
}

export function resize() {
    orbitBall.pos = vec(innerWidth / 2, innerHeight / 2);
}

export function stop() {
    world.setdown();
}
