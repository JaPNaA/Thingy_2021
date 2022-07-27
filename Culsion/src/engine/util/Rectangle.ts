export class Rectangle {
    constructor(public x: number, public y: number, public width: number, public height: number) { }

    public centerX() {
        return this.x + this.width / 2;
    }
    public centerY() {
        return this.y + this.height / 2;
    }
    public rightX() {
        return this.x + this.width;
    }
    public bottomY() {
        return this.y + this.height;
    }
}
