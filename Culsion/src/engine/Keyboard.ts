
type KeyboardEventHandler = (event: KeyboardEvent) => void;

export class Keyboard {
    private keys: { [x: string]: boolean } = {};
    private handlers: { [x: string]: KeyboardEventHandler[] } = {};

    constructor() {
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        console.log(this.keys);
    }

    public _startListen() {
        addEventListener("keyup", this.keyupHandler);
        addEventListener("keydown", this.keydownHandler);
    }

    public _stopListen() {
        removeEventListener("keyup", this.keyupHandler);
        removeEventListener("keydown", this.keydownHandler);
    }

    public async nextKeydown(keyCodes: string[]) {
        let promiseResFunc: KeyboardEventHandler;

        const promise = new Promise<KeyboardEvent>(res => {
            promiseResFunc = res;
            this.addKeydownHandler(keyCodes, promiseResFunc);
        });
        //* Potential problem: removing promise during handler
        promise.then(() => this.removeKeydownHandler(keyCodes, promiseResFunc));

        return promise;
    }

    public addKeydownHandler(keyCodes: string[], handler: KeyboardEventHandler) {
        for (const code of keyCodes) {
            const existing = this.handlers[code];
            if (existing) {
                existing.push(handler);
            } else {
                this.handlers[code] = [handler];
            }
        }
    }

    public removeKeydownHandler(keyCodes: string[], handler: KeyboardEventHandler) {
        for (const code of keyCodes) {
            const existing = this.handlers[code];
            if (!existing) { throw new Error("Tried to remove handler that doesn't exist"); }

            const index = existing.indexOf(handler);
            if (index < 0) { throw new Error("Tried to remove handler that doesn't exist"); }

            existing.splice(index, 1);
        }
    }

    public isDown(keyCodes: string[]) {
        for (const code of keyCodes) {
            if (this.keys[code]) { return true; }
        }
        return false;
    }

    private keyupHandler(event: KeyboardEvent) {
        this.keys[event.code] = false;
    }

    private keydownHandler(event: KeyboardEvent) {
        this.keys[event.code] = true;

        const handlers = this.handlers[event.code];
        if (handlers) {
            for (const handler of handlers) {
                handler(event);
            }
        }
    }
}
