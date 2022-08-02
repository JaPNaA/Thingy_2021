type ChoiceHandler = (options: any[], indexes: number[]) => number | Promise<number>;

export class FlowRunner {
    private instructionPointer = 0;
    private defaultHandler?: Function;
    private choiceHandler?: ChoiceHandler;
    private endHandler?: Function;

    private active = true;
    private markers: Map<string, number> = new Map();

    constructor(private data: FlowData) {
        for (let i = 0; i < data.flow.length; i++) {
            const item = data.flow[i];
            if (isControlMarker(item)) {
                this.markers.set(item.name, i);
            }
        }
    }

    public setDefaultHandler(func: Function) {
        this.defaultHandler = func;
    }

    public setChoiceHandler(handler: ChoiceHandler) {
        this.choiceHandler = handler;
    }

    public setEndHandler(handler: Function) {
        this.endHandler = handler;
    }

    public getIndex() {
        return this.instructionPointer;
    }

    public setIndex(index: number) {
        this.instructionPointer = index;
        this.active = true;
    }

    public isNextControlSplit() {
        const item = this.data.flow[this.instructionPointer];
        return isControlItem(item) && item.ctrl === "split";
    }

    public async runOne() {
        const item = this.data.flow[this.instructionPointer];
        if (isControlItem(item)) {
            await this.handleControl(item);
        } else {
            if (!this.defaultHandler) {
                throw new FlowRunException("No default handler when non-control instruction encountered");
            }
            await this.defaultHandler(item);
            this.instructionPointer++;
        }
    }

    public async runToEnd() {
        this.active = true;
        while (this.active) {
            await this.runOne();
        }
    }

    private async handleControl(item: ControlItem) {
        switch (item.ctrl) {
            case "split":
                if (!this.choiceHandler) { throw new FlowRunException("No choice handler when choice requested"); }
                const optionsData = [];
                const optionsIndexes: number[] = [];
                for (const option of item.options) {
                    optionsData.push(option.slice(1));
                    optionsIndexes.push(this.locationDescriptorToIndex(option[0]));
                }
                const index = await this.choiceHandler(optionsData, optionsIndexes);
                if (index < 0) { break; }
                this.instructionPointer = this.locationDescriptorToIndex(optionsIndexes[index]);
                break;
            case "marker":
                this.instructionPointer++;
                break;
            case "end":
                this.active = false;

                if (this.endHandler) {
                    this.endHandler();
                }
                break;
        }
    }

    private locationDescriptorToIndex(location: string | number): number {
        if (typeof location === "number") {
            return location;
        } else {
            const index = this.markers.get(location);
            if (index === undefined) {
                throw new FlowRunException(`Tried to go to ${location}, but no marker exists`);
            }
            return index + 1;
        }
    }
}

export class FlowRunException extends Error { };

export interface FlowData {
    meta: any;
    flow: (ControlItem | any)[];
}

type ControlItem = ControlSplit | ControlMarker | ControlEnd;
function isControlItem(item: any): item is ControlItem {
    return typeof item.ctrl === "string";
}

interface ControlSplit {
    ctrl: "split";
    options: [string | number, ...any][];
}

interface ControlMarker {
    ctrl: "marker";
    name: string;
}
function isControlMarker(item: any): item is ControlMarker {
    return item.ctrl === "marker";
}

interface ControlEnd {
    ctrl: "end";
}
