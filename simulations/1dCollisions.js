import { vec } from "../utils/vectors.js";
import { VectorLinearInput } from "../engine/components/vectorInput/VectorLinearInput.js";
import { World } from "../engine/World.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { Elm } from "../utils/elements.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";

const equations = {

    vf1: (m1, m2, vi1, vi2) =>
        (m1 - m2) / (m1 + m2) * vi1 +
        (2 * m2) / (m1 + m2) * vi2,

    vf2: (m1, m2, vi1, vi2) =>
        (2 * m1) / (m1 + m2) * vi1 +
        (m2 - m1) / (m1 + m2) * vi2,

    collisionPoint: (p1, p2, v1, v2) =>
        (v1 / (v1 - v2)) * (p2 - p1) + p1

};

class CollisionDraw extends CanvasElm {
    constructor() {
        super();

        this.leftPos = CollisionDraw.initialPosLeft;
        this.leftVelocity = CollisionDraw.initalVelocities;
        this.leftMass = CollisionDraw.initialMasses;
        this.leftWidth = 100;
        this.leftHeight = 100;

        this.rightPos = CollisionDraw.initialPosRight;
        this.rightVelocity = CollisionDraw.initalVelocities.scale(-1);
        this.rightMass = CollisionDraw.initialMasses;
        this.rightWidth = 100;
        this.rightHeight = 100;


        this.collisionPoint = 0;
        this.updateCollisionPoint();

    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        //Object 1
        X.beginPath();
        X.rect(this.leftPos.x, this.leftPos.y, this.leftWidth, this.leftHeight);
        X.fillStyle = "#ff0000";
        X.fill();

        //Object 2
        X.beginPath();
        X.rect(this.rightPos.x, this.rightPos.y, this.rightWidth, this.rightHeight);
        X.fillStyle = "blue";
        X.fill();

        X.fillStyle = "#ffffff";
        X.fillRect(this.collisionPoint, 200, 1, 200);
    }

    updateCollisionPoint() {
        this.collisionPoint = equations.collisionPoint(
            this.leftPos.x + this.leftWidth, this.rightPos.x,
            this.leftVelocity.x, this.rightVelocity.x
        );
    }
}

CollisionDraw.initialPosLeft = vec(0, 200);
CollisionDraw.initialPosRight = vec(600, 200);
CollisionDraw.initalVelocities = vec(50, 0);
CollisionDraw.initialMasses = 10;

class ResetButton extends HTMLCanvasElm {
    constructor() {
        super();

        this.append(
            new Elm("button")
                .append("Reset")
                .on("click", () => {
                    collisionDraw.leftVelocity = velocity1Input.getVec2();
                    collisionDraw.leftPos = CollisionDraw.initialPosLeft;
                    collisionDraw.leftMass = mass1Input.getVec2().magnitude;
                    collisionDraw.leftWidth = collisionDraw.leftHeight = Math.sqrt(collisionDraw.leftMass) * 16;

                    collisionDraw.rightVelocity = velocity2Input.getVec2();
                    collisionDraw.rightPos = CollisionDraw.initialPosRight;
                    collisionDraw.rightMass = mass2Input.getVec2().magnitude;
                    collisionDraw.rightWidth = collisionDraw.rightHeight = Math.sqrt(collisionDraw.rightMass) * 16;

                    collisionDraw.updateCollisionPoint();
                    collided = false;
                })
        );
    }
}


// User Inputs
const velocity1Input = new VectorLinearInput(CollisionDraw.initalVelocities, vec(100, 100));
velocity1Input.setUnitText("m/s");

const mass1Input = new VectorLinearInput(vec(CollisionDraw.initialMasses, 0), vec(100, 140));
mass1Input.setUnitText("kg");

const velocity2Input = new VectorLinearInput(CollisionDraw.initalVelocities.scale(-1), vec(500, 100));
velocity2Input.setUnitText("m/s");

const mass2Input = new VectorLinearInput(vec(-CollisionDraw.initialMasses, 0), vec(500, 140));
mass2Input.setUnitText("kg");


const collisionDraw = new CollisionDraw();
const reset = new ResetButton();

let world;
let collided = false;

export function start(newWorld) {
    world = newWorld;
    world.addElm(collisionDraw);
    world.addElm(reset);
    world.addElm(velocity1Input, mass1Input, velocity2Input, mass2Input);
}

export function update(timeElapsed) {
    collisionDraw.leftPos = collisionDraw.leftPos.add(collisionDraw.leftVelocity.scale(timeElapsed));
    collisionDraw.rightPos = collisionDraw.rightPos.add(collisionDraw.rightVelocity.scale(timeElapsed));

    if (collisionDraw.leftPos.x + collisionDraw.leftWidth >= collisionDraw.rightPos.x && !collided) {
        const newVelLeft = vec(
            equations.vf1(
                collisionDraw.leftMass, collisionDraw.rightMass,
                collisionDraw.leftVelocity.x, collisionDraw.rightVelocity.x
            ), 0
        );
        const newVelRight = vec(
            equations.vf2(
                collisionDraw.leftMass, collisionDraw.rightMass,
                collisionDraw.leftVelocity.x, collisionDraw.rightVelocity.x
            ), 0
        );
        collisionDraw.leftVelocity = newVelLeft;
        collisionDraw.rightVelocity = newVelRight;
        
        // temp fix to the blocks 'gluing' together
        collisionDraw.leftPos.x = collisionDraw.collisionPoint - collisionDraw.leftWidth;
        collisionDraw.rightPos.x = collisionDraw.collisionPoint;
        collided = true;
    }

}
