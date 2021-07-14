import { Rectangle } from "../engine/util/Rectangle";
import { dialogFetcher } from "../resources/dialogFetcher";
import { NPCDialog } from "../ui/NPCDialog";
import { NPC } from "./NPC";
import { Player } from "./Player";

export class NPCWithDialog extends NPC {
    private dialogOpen = false;

    private npcDialog?: NPCDialog;

    onCollision(other: any) {
        if (!(other instanceof Player)) { return; }
        if (this.dialogOpen) { return; }
        this.dialogOpen = true;

        dialogFetcher.fetch("testDialog").then(dialog => {
            this.npcDialog = new NPCDialog(dialog, new Rectangle(this.rect.x, this.rect.y, 500, 300));
            this.world.addElm(this.npcDialog);
        });
    }

    public dispose() {
        if (this.npcDialog) {
            this.world.removeElm(this.npcDialog);
        }
    }
}
