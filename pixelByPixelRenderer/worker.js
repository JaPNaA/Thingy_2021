/**
 * @param {number} width
 * @param {number} height
 * @param {(x: number, y: number, w: number, h: number) => number} fn
 */
function render(fn, width, height) {
    const canvas = new OffscreenCanvas(width, height);
    const X = canvas.getContext("2d");

    const imageData = X.getImageData(0, 0, width, height);

    for (let y = 0; y < height; y++) {
        const yOff = y * width;
        for (let x = 0; x < width; x++) {
            const value = fn(x, y, width, height);
            const index4 = (yOff + x) * 4;
            imageData.data[index4] = (value & 0xff0000) >> 16;
            imageData.data[index4 + 1] = (value & 0x00ff00) >> 8;
            imageData.data[index4 + 2] = value & 0x0000ff;
            imageData.data[index4 + 3] = 255;
        }
    }

    X.putImageData(imageData, 0, 0);

    return canvas.transferToImageBitmap();
}

/**
 * @param {string} code 
 * @param {number} width 
 * @param {number} height 
 */
function run(code, width, height) {
    try {
        const inputFunc = new Function("x", "y", "w", "h", "return " + code);
        // @ts-ignore
        return render(inputFunc, width, height);
    } catch (err) {
        return err;
    }
}

addEventListener("message", function (data) {
    const { width, height, code } = data.data;
    const val = run(code, width, height);

    // @ts-ignore
    postMessage(val);
});