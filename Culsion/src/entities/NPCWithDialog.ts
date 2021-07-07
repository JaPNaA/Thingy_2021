import { dialogFetcher } from "../resources/dialogFetcher";
import { NPCDialog } from "../ui/NPCDialog";
import { NPC } from "./NPC";

export class NPCWithDialog extends NPC {
    private dialogOpen = false;

    onCollision() {
        if (this.dialogOpen) { return; }
        this.dialogOpen = true;

        dialogFetcher.fetch("testDialog").then(dialog => {
            this.world.addElm(new NPCDialog(dialog));
        });
    }

    public dispose() {
        throw new Error("Not implemented");
    }
}
