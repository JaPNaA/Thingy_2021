import { FlowRunner } from "../engine/FlowRunner";
import { resourceFetcher } from "./resourceFetcher";

class DialogFetcher {
    public async fetch(url: string) {
        const str = await resourceFetcher.fetchText("assets/" + url + ".json");
        const json = JSON.parse(str);
        return new FlowRunner(json);
    }
}

export const dialogFetcher = new DialogFetcher();
