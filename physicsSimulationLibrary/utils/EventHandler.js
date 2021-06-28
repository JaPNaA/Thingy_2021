
/**
 * @typedef { (data: any) => void } EventHandlerFunction
 */

export class EventHandler {
    constructor() {
        /** @type {EventHandlerFunction[]} */
        this.handlers = [];
    }

    /** @param {EventHandlerFunction} handler */
    addHandler(handler) {
        this.handlers.push(handler);
    }

    /** @param {EventHandlerFunction} handler */
    removeHandler(handler) {
        const index = this.handlers.indexOf(handler);
        if (index < 0) { throw new Error("Can't remove handler that doesn't exist"); }
        this.handlers.splice(index, 1);
    }

    /** @param {any} data */
    dispatch(data) {
        for (const handler of this.handlers) {
            handler(data);
        }
    }
}
