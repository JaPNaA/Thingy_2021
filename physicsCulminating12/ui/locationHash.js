import { EventHandler } from "../utils/EventHandler.js";

class LocationHash {
    constructor() {
        this._settingHash = false;

        this.onUserHashChange = new EventHandler();

        addEventListener("hashchange", () => {
            if (this._settingHash) { return; }
            this.onUserHashChange.dispatch(this.getHash());
        });
    }

    setHash(hash) {
        this._settingHash = true;
        location.hash = "#" + hash;
        setTimeout(() => this._settingHash = false, 1);
    }

    getHash() {
        return location.hash.slice(1);
    }
}

const locationHash = new LocationHash();

export { locationHash };
