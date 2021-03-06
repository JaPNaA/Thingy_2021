import { Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";
import { Elm } from "../utils/elements.js";
import { VectorArrow } from "../engine/components/vectorArrow/VectorArrow.js";
import { camelToTitleCase } from "../utils/camelToTitleCase.js";
import { Grid } from "../engine/components/Grid.js";

const G = 6.67e-11;

/**
 * @typedef {Object} PlanetDataEntry
 * @property {number} mass - mass in kilograms
 * @property {number} radius - radius in meters
 * @property {string | undefined} color - color of planet
 */

/**
 * @type { { [x: string]: PlanetDataEntry } }
 */
const planetData = {
    earth: {
        mass: 5.97e24,
        radius: 6378e3,
        color: "#3c469b"
    },

    moon: {
        mass: 0.073e24,
        radius: 1737.5e3,
        color: "#817d7c"
    },

    mercury: {
        mass: 0.330e24,
        radius: 2439.5e3,
        color: "#a77f68"
    },

    mars: {
        mass: 0.642e24,
        radius: 3396e3,
        color: "#bd7954"
    },

    venus: {
        mass: 4.867e24,
        radius: 6051.8e3,
        color: "#eedece"
    },

    jupiter: {
        mass: 1898e24,
        radius: 71492e3,
        color: "#cdb589"
    },

    neptune: {
        mass: 102.4e24,
        radius: 24764e3,
        color: "#3e5ef3"
    },

    saturn: {
        mass: 568.3e24,
        radius: 60268e3,
        color: "#d3b177"
    },

    pluto: {
        mass: 0.0146e24,
        radius: 1185.3e3,
        color: "#d7c8b9"
    },

    sun: {
        mass: 1.989e30,
        radius: 695000e3,
        color: "#fd9237"
    }

};

class PresetSelector extends HTMLCanvasElm {
    constructor() {
        super();
        this.staticPosition = true;

        this.selectElm = new Elm("select")
            .attribute("style", `
                background: #000000;
                color: inherit;
            `);
        this.append(this.selectElm);

        const planets = Object.keys(planetData);
        for (const planet of planets) {
            this.selectElm.append(
                new Elm("option")
                    .append(camelToTitleCase(planet))
                    .attribute("value", JSON.stringify(planetData[planet]))
            );
        }

        this.selectElm.on("change", () => {
            /** @type {PlanetDataEntry} */
            const data = JSON.parse(this.selectElm.elm.value);
            expressionSolver.setVariableValue("r", data.radius);
            expressionSolver.setVariableValue("m", data.mass);
            orbitDraw.planetColor = data.color;
        });
    }
}

const vectArrow = new VectorArrow();

class OrbitDraw extends CanvasElm {
    constructor() {
        super();
        this.staticPosition = true;

        this.angle = 0;
        this.orbitRadius = 0;
        this.pos = vec(0, 0);

        this.planetRadius = 0;
        this.planetColor = planetData.earth.color;
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const pos = Vec2.fromPolar(this.orbitRadius, this.angle).add(this.pos)
        const absPos = this.world.camera.transformPoint(pos);

        const center = this.world.camera.transformPoint(vec(0, 0));

        // draw planet
        X.beginPath();
        X.arc(center.x, center.y, this.planetRadius * this.world.camera.zoom, 0, 2 * Math.PI);
        X.fillStyle = this.planetColor || "#444444";
        X.fill();

        // drawing orbit
        X.beginPath();
        X.arc(center.x, center.y, this.orbitRadius * this.world.camera.zoom, 0, 2 * Math.PI);
        X.strokeStyle = "#ffffff";
        X.lineWidth = 1;
        X.stroke();

        // drawing orbiting object
        X.beginPath();
        X.arc(absPos.x, absPos.y, 4, 0, 2 * Math.PI);
        X.fillStyle = "#ff0000";
        X.fill();

        vectArrow.setTail(pos);
        vectArrow.setValue(
            Vec2.fromPolar(-this.orbitRadius / 5, this.angle)
        );
    }
}

const expressionSolver = new ExpressionSolver({
    variables: ["v", ["m", planetData.earth.mass], ["r", planetData.earth.radius], ["h", 500e3]],
    expression: vars => new Expression( // v^2 = GM / r
        "subtract",
        new Expression(
            "power", vars.v, 2
        ),

        new Expression(
            "divide",
            new Expression(
                "multiply", G, vars.m
            ),
            new Expression("add",
                vars.r, vars.h
            )
        )
    )
});

let world;
const orbitDraw = new OrbitDraw();
const presetSelector = new PresetSelector();

export function start(newWorld) {
    world = newWorld;
    world.addElm(orbitDraw);
    world.addElm(presetSelector);
    world.addElm(vectArrow);
    world.addElm(new Grid());

    world.camera.zoom = 0.00003;
    world.camera.centerOn(vec(0, 0));

    expressionSolver.addFormToWorld(world);
}

export function update(timeElapsed) {
    const planetRadius = expressionSolver.variables.r.eval();
    const height = expressionSolver.variables.h.eval();
    const orbitRadius = planetRadius + height;
    const angularVelocity = expressionSolver.variables.v.eval() / orbitRadius;

    orbitDraw.angle += angularVelocity * timeElapsed;
    orbitDraw.orbitRadius = orbitRadius;
    orbitDraw.planetRadius = planetRadius;
}
