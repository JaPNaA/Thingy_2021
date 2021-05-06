import { Component } from "../utils/elements.js";

class UserInterface extends Component {
    constructor() {
        super("userInterface");
        
        /** @type {View[]} */
        this.views = [];
    }

    /** @param {View} view */
    setView(view) {
        this.closeAllViews();
        this.addView(view);
    }

    /** @param {View} view */
    addView(view) {
        this.views.push(view);
        view.open(this.elm);
    }

    closeAllViews() {
        for (const view of this.views) {
            view.close();
        }
        this.views.length = 0;
    }

    onResize() {
        for (const view of this.views) {
            view.resize();
        }
    }
}

export const userInterface = new UserInterface();

userInterface.elm.appendTo(document.body);
addEventListener("resize", () => userInterface.onResize());
userInterface.onResize();
