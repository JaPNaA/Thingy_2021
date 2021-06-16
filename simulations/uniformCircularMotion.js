import { World } from "../engine/World.js";
import { Variable, Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";
import { VectorArrow } from "../engine/components/vectorArrow/VectorArrow.js";
import { colors } from "../ui/colors.js";
import { Grid } from "/engine/components/Grid.js";

const expressionSolver = new ExpressionSolver({
    variables: ["v", ["a", 40], ["r", 100]],
    expression: vars => new Expression(
        "subtract",
        vars.a,
        new Expression("divide",
            new Expression("power", vars.v, 2),
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

        X.strokeStyle = colors.white;
        X.fillStyle = colors.red;
        X.lineWidth = 1 / this.world.camera.zoom;

        X.beginPath();
        X.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        X.stroke();

        const ballPosRel = Vec2.fromPolar(this.radius, this.angle);
        const ballPos = ballPosRel.add(this.pos);

        X.beginPath();
        X.arc(ballPos.x, ballPos.y, 4 / this.world.camera.zoom, 0, Math.PI * 2);
        X.fill();

        const accelerationVecHead = ballPosRel.withMagnitude(-expressionSolver.variables.a.eval());
        this.accelerationArrow.setTail(ballPosRel.add(this.pos));
        this.accelerationArrow.setValue(accelerationVecHead);
    }
}

const orbitBall = new OrbitBall();

let world;

export function start(newWorld) {
    world = newWorld;
    world.addElm(new Grid());
    world.addElm(orbitBall);
    expressionSolver.addFormToWorld(world);

    world.camera.centerOn(orbitBall.pos);
}

export function update(timeElapsed) {
    const radius = expressionSolver.variables.r.eval();
    orbitBall.radius = radius;

    const angularSpeed = expressionSolver.variables.v.eval() / radius;
    orbitBall.angle += angularSpeed * timeElapsed;
}
