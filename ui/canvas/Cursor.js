export class Cursor {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.down = false;

        this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
        this._mouseDownHandler = this._mouseDownHandler.bind(this);
        this._mouseUpHandler = this._mouseUpHandler.bind(this);
    }

    setup() {
        addEventListener("mousemove", this._mouseMoveHandler);
        addEventListener("mousedown", this._mouseDownHandler);
        addEventListener("mouseup", this._mouseUpHandler);
    }

    setdown() {
        removeEventListener("mousemove", this._mouseMoveHandler);
        removeEventListener("mousedown", this._mouseDownHandler);
        removeEventListener("mouseup", this._mouseUpHandler);
    }

    /** @param {MouseEvent} e */
    _mouseMoveHandler(e) {
        this.x = e.clientX;
        this.y = e.clientY;
    }

    _mouseDownHandler() {
        this.down = true;
    }

    _mouseUpHandler() {
        this.down = false;
    }
}
