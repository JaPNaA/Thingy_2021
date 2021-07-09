import { Rectangle } from "../engine/util/Rectangle";
import { dialogFetcher } from "../resources/dialogFetcher";
import { NPCDialog } from "../ui/NPCDialog";
import { NPC } from "./NPC";
import { Player } from "./Player";

export class NPCWithDialog extends NPC {
    private dialogOpen = false;

    onCollision(other: any) {
        if (!(other instanceof Player)) { return; }
        if (this.dialogOpen) { return; }
        this.dialogOpen = true;

        dialogFetcher.fetch("testDialog").then(dialog => {
            this.world.addElm(new NPCDialog(dialog, new Rectangle(this.rect.x, this.rect.y, 500, 300)));
        });
    }

    public dispose() {
        throw new Error("Not implemented");
    }
}
