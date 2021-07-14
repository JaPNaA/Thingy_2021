import { Rectangle } from "../engine/util/Rectangle";
import { dialogFetcher } from "../resources/dialogFetcher";
import { NPCDialog } from "../ui/NPCDialog";
import { NPC } from "./NPC";
import { Player } from "./Player";

export class NPCWithDialog extends NPC {
    private npcDialog?: NPCDialog;
    private loadingDialog = false;

    onCollision(other: any) {
        if (!(other instanceof Player)) { return; }
        if (this.loadingDialog) { return; }
        if (this.npcDialog && !this.npcDialog.closed) { return; }

        this.loadingDialog = true;

        dialogFetcher.fetch("testDialog").then(dialog => {
            this.npcDialog = new NPCDialog(dialog, new Rectangle(this.rect.x, this.rect.y, 500, 300));
            this.world.addElm(this.npcDialog);
            this.loadingDialog = false;
        });
    }

    public dispose() {
        if (this.npcDialog && !this.npcDialog.closed) {
            this.world.removeElm(this.npcDialog);
        }
    }
}
