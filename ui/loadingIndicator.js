export const loadingIndicator = {
    element: document.getElementById("loading"),
    showDelayPromiseReject: () => {},

    hide() {
        this.showDelayPromiseReject();

        loadingIndicator.element.classList.add("hiding");
        setTimeout(() => {
            loadingIndicator.element.classList.add("hidden");
        }, 250);
    },

    async show() {
        await loadingIndicator.showDelay();
        loadingIndicator.element.classList.remove("hiding");
        loadingIndicator.element.classList.remove("hidden");
    },

    showDelay() {
        return new Promise((res, rej) => {
            this.showDelayPromiseReject = () => rej("Loading indicator show canceled");
            setTimeout(res, 50);
        });
    }
};
