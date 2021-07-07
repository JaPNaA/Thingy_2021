class ResourceFetcher {
    private cache: Map<string, string> = new Map();

    public async fetch(url: string): Promise<string> {
        const cached = this.cache.get(url);
        if (cached) {
            return cached;
        } else {
            const response = await fetch(url);
            const result = await response.text();
            this.cache.set(url, result);
            return result;
        }
    }
}

export const resourceFetcher = new ResourceFetcher();
