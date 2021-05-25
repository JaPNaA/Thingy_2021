/**
 * MathLib - solves simple equasions
 * Version 1.1 (modular)
 */

/**
 * @typedef Evaluable
 * @property {() => number} eval
 * @property {Evaluable} [parent]
 * @property {() => Evaluable} copy
 */

/**
 * Represents a variable or constant in a mathematical expression
 */
export class Variable {
    /** @param {number | string} [val] */
    constructor(val) {
        this.name = "x";
        this.known = false;
        this.value = 0;

        if (typeof val === 'undefined') {
            this.value = 0;
        } else if (typeof val === "string") {
            this.name = val;
        } else {
            this.known = true;
            this.value = val;
        }

        /** @type {Expression | null} */
        this.parent = null;
    }

    /** @param {number} value */
    setKnownValue(value) {
        this.value = value;
        this.known = true;
    }

    setUnknown() {
        this.known = false;
    }

    eval() {
        if (!this.known) { throw new CantEvaluateException(); }
        return this.value;
    }

    toString() {
        if (this.known) { return this.value.toString(); }
        return this.name;
    }

    copy() {
        const v = new Variable();
        v.known = this.known;
        v.value = this.value;
        return v;
    }

    solveForSelf() {
        const { parentExpressions, topExpression } = this._getParentExpressions();
        let leftSide = new Expression("zero");
        let rightSide = topExpression;

        while (true) { // @ts-ignore
            if (parentExpressions.includes(rightSide.a) || rightSide.a === this) {
                // variable is on the a side
                leftSide = this._makeExpression(
                    expressions[rightSide.type].opposite,
                    leftSide, rightSide.b
                );

                if (rightSide.a instanceof Expression) {
                    rightSide = rightSide.a;
                } else {
                    break;
                }
            } else {
                const flop = expressions[rightSide.type].flop;
                // variable is on the b side
                if (flop) {
                    // expression is transitive
                    leftSide = new Expression(flop,
                        this._makeExpression(rightSide.type, leftSide, rightSide.a)
                    );

                    if (rightSide.b instanceof Expression) {
                        rightSide = rightSide.b;
                    } else {
                        break;
                    }
                } else {
                    // expression is not transative
                    leftSide = this._makeExpression(
                        expressions[rightSide.type].opposite,
                        leftSide, rightSide.a
                    );
                    if (rightSide.b instanceof Expression) {
                        rightSide = rightSide.b;
                    } else {
                        break;
                    }
                }
            }
        }

        return leftSide;
    }

    /**
     * @param {string} type 
     * @param {Evaluable} [a]
     * @param {Evaluable} [b]
     */
    _makeExpression(type, a, b) {
        return new Expression(
            type,
            a && a.copy(), b && b.copy()
        );
    }

    _getParentExpressions() {
        const list = [];
        let curr = this.parent;
        let top = curr;
        while (curr) {
            list.push(curr);
            top = curr;
            curr = curr.parent;
        }
        return { parentExpressions: list, topExpression: top };
    }
}

/**
 * Represents an expresion with one mathematical operation
 */
export class Expression {
    /**
     * @param {string} type 
     * @param {Evaluable | number} [a]
     * @param {Evaluable | number} [b]
     */
    constructor(type, a, b) {
        if (!type) { return; }
        this.type = type;

        /** @type {Evaluable} */
        this.a = typeof a === "number" ?
            new Variable(a) : a;

        /** @type {Evaluable} */
        this.b = typeof b === "number" ?
            new Variable(b) : b;

        if ((this.a && this.a.parent) || (this.b && this.b.parent)) {
            throw new Error("Parent already set");
        }
        if (this.a) { this.a.parent = this; }
        if (this.b) { this.b.parent = this; }

        /** @type {Expression | null} */
        this.parent = null;
    }

    toString() {
        return "(" +
            expressions[this.type].string
                .replace("a", this.a ? this.a.toString() : "")
                .replace("b", this.b ? this.b.toString() : "")
            + ")";
    }

    eval() {
        return expressions[this.type].eval(this.a && this.a.eval(), this.b && this.b.eval());
    }

    copy() {
        const exp = new Expression(this.type);
        exp.a = this.a;
        exp.b = this.b;
        return exp;
    }
}

/**
 * @typedef ExpressionType
 * @property {(...inputs: number[]) => number} eval
 * @property {string} [flop] required if expression is not transative; a - b = 0 --> a = -(-b)
 * @property {string} [opposite]
 * @property {string} [string]
 */

/**
 * A list of operations
 * @type { { [x: string]: ExpressionType } }
 */
const expressions = {
    add: {
        string: "a + b",
        eval: (a, b) => a + b,
        opposite: "subtract"
    },

    subtract: {
        string: "a - b",
        eval: (a, b) => a - b,
        flop: "negative",
        opposite: "add"
    },

    negative: {
        string: "-a",
        eval: a => -a
    },

    multiply: {
        string: "a * b",
        eval: (a, b) => a * b,
        opposite: "divide"
    },

    divide: {
        string: "a / b",
        eval: (a, b) => a / b,
        flop: "reciprocol",
        opposite: "multiply"
    },

    reciprocol: {
        string: "(a)**-1",
        eval: a => 1 / a
    },

    power: {
        string: "a ** b",
        eval: (a, b) => a ** b,
        flop: "error",
        opposite: "powerReciprocol"
    },

    powerReciprocol: {
        string: "a ** (1/b)",
        eval: (a, b) => a ** (1 / b),
        flop: "error",
        opposite: "power"
    },

    zero: {
        string: "0",
        eval: () => 0
    },

    error: {
        string: "<ERROR>",
        eval: () => { throw new CantEvaluateException(); }
    }
};

/**
 * An error thrown when trying to evaluate an expression
 * with an unknown variable
 */
class CantEvaluateException extends Error {
    constructor() {
        super("Can't evaluate expression");
    }
}
