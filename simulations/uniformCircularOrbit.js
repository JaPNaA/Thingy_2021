import { World } from "../engine/World.js";
import { Expression } from "../utils/mathLib.js";
import { CanvasElm } from "../engine/canvas/CanvasElm.js";
import { vec, Vec2 } from "../utils/vectors.js";
import { ExpressionSolver } from "../engine/components/expressionSolver/ExpressionSolver.js";
import { HTMLCanvasElm } from "../engine/htmlCanvas/HTMLCanvasElm.js";
import { Elm } from "../utils/elements.js";
import { VectorArrow } from "../engine/components/vectorArrow/VectorArrow.js";

const G = 6.67e-11;

/**
 * @typedef {Object} PlanetDataEntry
 * @property {number} mass - mass in kilograms
 * @property {number} radius - radius in meters
 */

/**
 * @type { { [x: string]: PlanetDataEntry } }
 */
const planetData = {
    earth: {
        mass: 5.98e24,
        radius: 6.398e6,
    },

    moon: {
        mass: 7.34767309e22,
        radius: 1731.1e3,
    },

    mercury: {
        mass: 3.285e23,
        radius: 2439.7e3,
    },

    mars: {
        mass: 6.39e23,
        radius: 3389.5e3,
    },

    venus: {
        mass: 4.867e24,
        radius: 6051.8e3,
    },

    jupiter: {
        mass: 1.898e27,
        radius: 69911e3,
    },

    neptune: {
        mass: 1.024e26,
        radius: 24622e3
    },

    saturn: {
        mass: 5.683e26,
        radius: 58232e3
    },

    pluto: {
        mass: 1.3900e22,
        radius: 1188.3e3
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
                    .append(planet)
                    .attribute("value", JSON.stringify(planetData[planet]))
            );
        }

        this.selectElm.on("change", () => {
            /** @type {PlanetDataEntry} */
            const data = JSON.parse(this.selectElm.elm.value);
            expressionSolver.setVariableValue("r", data.radius);
            expressionSolver.setVariableValue("m", data.mass);
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
    }

    draw() {
        /** @type {CanvasRenderingContext2D} */
        const X = this.world.canvas.X;

        const pos = Vec2.fromPolar(this.orbitRadius, this.angle).add(this.pos)
        const absPos = this.world.camera.transformPoint(pos);

        const center = this.world.camera.transformPoint(vec(0, 0));

        // drawing orbit
        X.beginPath();
        X.arc(center.x, center.y, this.orbitRadius * this.world.camera.zoom, 0, 2*Math.PI);
        X.strokeStyle = "#ffffff";
        X.lineWidth = 1;
        X.stroke();

        // drawing orbiting object
        X.beginPath();
        X.arc(absPos.x, absPos.y, 4, 0, 2*Math.PI);
        X.fillStyle = "#ff0000";
        X.fill();

        vectArrow.setTail(pos);
        vectArrow.setValue(
            Vec2.fromPolar(-this.orbitRadius / 5, this.angle)
        );
    }
}

const expressionSolver = new ExpressionSolver({
    variables: ["v", ["m", planetData.earth.mass], ["r", planetData.earth.radius]],
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
            vars.r
        )
    )
});

let world;
const orbitDraw = new OrbitDraw();
const presetSelector = new PresetSelector();

export function start(asdf) {
    world = new World(asdf);
    world.addElm(orbitDraw);
    world.addElm(presetSelector);
    world.addElm(vectArrow);

    expressionSolver.addFormToWorld(world);
}

export function update(timeElapsed) {
    const angularVelocity = expressionSolver.variables.v.eval() / expressionSolver.variables.r.eval();

    orbitDraw.angle += angularVelocity * timeElapsed;
    orbitDraw.orbitRadius = expressionSolver.variables.r.eval();
    
    world.draw();
}

export function stop() {
    world.setdown();
}
