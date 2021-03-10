/** @type {HTMLInputElement} */ // @ts-ignore
const input = document.getElementById("input");
const loadingElm = document.getElementById("loading");
const errorElm = document.getElementById("error");

/** @type {HTMLCanvasElement} */ // @ts-ignore
const canvas = document.getElementById("canvas");


canvas.width = 1024;
canvas.height = 1024;

const X = canvas.getContext("2d");

/** @param {ImageBitmap} bitmap */
function render(bitmap) {
    X.drawImage(bitmap, 0, 0);
}

input.addEventListener("input", tryRunInput);

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
        code: input.value,
        width: canvas.width,
        height: canvas.height
    });
    isWorkerRunning = true;
    workerTimeout = Date.now() + 500;
    loadingElm.classList.add("show");
    loadingElm.innerText = "Loading...";

    worker.addEventListener("message", function (data) {
        console.log(data);
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
