export const loadingIndicator = {
    element: document.getElementById("loading"),
    _showDelayPromiseReject: () => {},
    _hideDelayPromiseReject: () => {},

    async hide() {
        loadingIndicator._showDelayPromiseReject();
        await loadingIndicator._hideDelay();

        loadingIndicator.element.classList.add("hiding");
        setTimeout(() => {
            loadingIndicator.element.classList.add("hidden");
        }, 250);
    },

    async show() {
        loadingIndicator._hideDelayPromiseReject();
        await loadingIndicator._showDelay();

        loadingIndicator.element.classList.remove("hiding");
        loadingIndicator.element.classList.remove("hidden");
    },

    _showDelay() {
        return new Promise((res, rej) => {
            loadingIndicator._showDelayPromiseReject = () => rej("Loading indicator show canceled");
            setTimeout(res, 50);
        });
    },

    _hideDelay() {
        return new Promise((res, rej) => {
            loadingIndicator._hideDelayPromiseReject = () => rej("Loading indicator hide canceled");
            setTimeout(res, 50);
        });
    }
};
