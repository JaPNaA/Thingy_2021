export class FlowRunner {
    private instructionPointer = 0;

    private active = true;
    private markers: Map<string, number> = new Map();
    private output: FlowRunnerOutput | null = null;

    constructor(private data: FlowData) {
        for (let i = 0; i < data.flow.length; i++) {
            const item = data.flow[i];
            if (isControlMarker(item)) {
                this.markers.set(item.name, i);
            }
        }
    }

    /** Get the instruction pointer's location */
    public getIndex() {
        return this.instructionPointer;
    }

    /** Set the instruction pointer's location */
    public setIndex(index: number) {
        this.instructionPointer = index;
        this.active = true;
    }

    /** Gets the output of the flow runner */
    public getOutput(): FlowRunnerOutput | null {
        return this.output;
    }

    /** If active, the flow runner has not reached the end. */
    public isActive() {
        return this.active;
    }

    /** If at a split choice, inputs the choice into the flowRunner. */
    public inputSplitChoice(splitChoice: number) {
        const item = this.data.flow[this.instructionPointer];
        if (!isControlItem(item) || item.ctrl !== "split") {
            throw new Error("Cannot input split choice at non-split instruction");
        }
        this.instructionPointer = this.locationDescriptorToIndex(item.options[splitChoice][0]);
    }

    public runOne() {
        const item = this.data.flow[this.instructionPointer];
        this.output = null;

        if (isControlItem(item)) {
            this.handleControl(item);
        } else {
            this.output = {
                type: "default",
                data: item
            };
            this.instructionPointer++;
        }
    }

    // public runToEnd() {
    //     this.active = true;
    //     while (this.active) {
    //         this.runOne();
    //     }
    // }

    private handleControl(item: ControlItem) {
        switch (item.ctrl) {
            case "split":
                const optionsData = [];
                const indexes: number[] = [];
                for (const option of item.options) {
                    optionsData.push(option.slice(1));
                    indexes.push(this.locationDescriptorToIndex(option[0]));
                }
                this.output = { type: "choice", choices: optionsData, indexes: indexes };
                break;
            case "marker":
                this.instructionPointer++;
                break;
            case "end":
                this.active = false;
                this.output = { type: "end" };
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

export type FlowRunnerOutput = FlowRunnerOutputDefault | FlowRunnerOutputChoice | FlowRunnerOutputEnd;

interface FlowRunnerOutputDefault {
    type: "default";
    data: any;
}

interface FlowRunnerOutputChoice {
    type: "choice";
    choices: any[];
    indexes: number[];
}

interface FlowRunnerOutputEnd {
    type: "end";
}

// Flow data
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
    /** [location descriptor, ...choice data] */
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
