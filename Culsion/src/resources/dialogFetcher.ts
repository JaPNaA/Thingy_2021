import { resourceFetcher } from "./resourceFetcher";

class DialogFetcher {
    public async fetch(url: string) {
        const str = await resourceFetcher.fetch("assets/" + url + ".txt");
        const lines = str.split("\n");
        const arr: string[] = [];

        let currArrElm: string[] = [];

        for (const line of lines) {
            if (line === "") {
                arr.push(currArrElm.join("\n"));
                currArrElm.length = 0;
            } else {
                currArrElm.push(line);
            }
        }

        if (currArrElm.length) {
            arr.push(currArrElm.join("\n"));
        }

        return arr;
    }
}

export const dialogFetcher = new DialogFetcher();
