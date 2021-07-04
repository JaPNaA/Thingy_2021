export default class Keyboard {
    private keys: { [x: string]: boolean } = {};

    constructor() {
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        console.log(this.keys);
    }

    public startListen() {
        addEventListener("keyup", this.keyupHandler);
        addEventListener("keydown", this.keydownHandler);
    }

    public stopListen() {
        removeEventListener("keyup", this.keyupHandler);
        removeEventListener("keydown", this.keydownHandler);
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
    }
}
