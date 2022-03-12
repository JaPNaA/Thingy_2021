import { TileMap } from "../entities/tilemap/TileMap";
import { resourceFetcher } from "./resourceFetcher";

class TileMapFetcher {
    public async fetch(url: string): Promise<TileMap> {
        const data = await resourceFetcher.fetchRaw("assets/map/" + url + ".tmap");
        return new TileMap(data);
    }
}

export const tileMapFetcher = new TileMapFetcher();
