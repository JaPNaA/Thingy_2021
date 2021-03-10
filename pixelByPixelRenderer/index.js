/** @type {HTMLInputElement} */ // @ts-ignore
const input = document.getElementById("input");

/** @type {HTMLCanvasElement} */ // @ts-ignore
const canvas = document.getElementById("canvas");

canvas.width = 1024;
canvas.height = 1024;

const X = canvas.getContext("2d");

/** @param {(x: number, y: number, w: number, h: number) => number} fn */
function render(fn) {
    const imageData = X.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        const yOff = y * canvas.width;
        for (let x = 0; x < canvas.width; x++) {
            const value = fn(x, y, canvas.width, canvas.height);
            const index4 = (yOff + x) * 4;
            imageData.data[index4] = (value & 0xff0000) >> 16;
            imageData.data[index4 + 1] = (value & 0x00ff00) >> 8;
            imageData.data[index4 + 2] = value & 0x0000ff;
            imageData.data[index4 + 3] = 255;
        }
    }

    X.putImageData(imageData, 0, 0);
}

input.addEventListener("input", tryRunInput);

function tryRunInput() {
    try {
        const inputFunc = new Function("x", "y", "w", "h", "return " + input.value);
        // @ts-ignore
        render(inputFunc);
    } catch (err) {
        console.log(err);
    }
}

tryRunInput();
