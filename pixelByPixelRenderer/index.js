/** @type {HTMLInputElement} */ // @ts-ignore
const codeInput = document.getElementById("input");
/** @type {HTMLInputElement} */ // @ts-ignore
const widthInput = document.getElementById("width");
/** @type {HTMLInputElement} */ // @ts-ignore
const heightInput = document.getElementById("height");

const loadingElm = document.getElementById("loading");
const errorElm = document.getElementById("error");

/** @type {HTMLCanvasElement} */ // @ts-ignore
const canvas = document.getElementById("canvas");


canvas.width = 512;
canvas.height = 512;

const X = canvas.getContext("2d");

/** @param {ImageBitmap} bitmap */
function render(bitmap) {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    updateWidthHeightInputValues();
    X.drawImage(bitmap, 0, 0);
}

function updateWidthHeightInputValues() {
    widthInput.value = canvas.width.toString();
    heightInput.value = canvas.height.toString();
}

updateWidthHeightInputValues();

codeInput.addEventListener("input", tryRunInput);
widthInput.addEventListener("input", () => {
    beforeResize();
    canvas.width = getInputValueNonnegativeNonzero(widthInput.value);
    resize();
});
heightInput.addEventListener("input", () => {
    beforeResize();
    canvas.height = getInputValueNonnegativeNonzero(heightInput.value);
    resize();
});

/** @param {string} str */
function getInputValueNonnegativeNonzero(str) {
    const parsed = parseInt(str);
    if (parsed <= 0) {
        return 1;
    } else if (isNaN(parsed)) {
        return 1;
    } else {
        return parsed;
    }
}

let beforeResizeImage;

function beforeResize() {
    beforeResizeImage = X.getImageData(0, 0, canvas.width, canvas.height);
}

function resize() {
    if (beforeResizeImage) {
        X.putImageData(beforeResizeImage, 0, 0);
    }

    tryRunInput();
}

/** @type {Worker} */
let worker;
let isWorkerRunning = false;
let workerTimeout = 0;

function tryRunInput() {
    if (isWorkerRunning) {
        if (Date.now() < workerTimeout) {
            return;
        } else {
            resetWorker();
        }
    }

    worker.postMessage({
        code: codeInput.value,
        width: canvas.width,
        height: canvas.height
    });
    isWorkerRunning = true;
    workerTimeout = Date.now() + 500;
    loadingElm.classList.add("show");
    loadingElm.innerText = "Loading...";

    worker.addEventListener("message", function (data) {
        if (data.data instanceof ImageBitmap) {
            render(data.data);
            errorElm.innerText = "";
        } else {
            errorElm.classList.add("show");
            errorElm.innerText = data.data.toString();
        }

        isWorkerRunning = false;
        resetWorker();
    });
}

function resetWorker() {
    loadingElm.classList.remove("show");
    if (worker) { worker.terminate() };
    worker = new Worker("./worker.js");
}


resetWorker();
tryRunInput();
