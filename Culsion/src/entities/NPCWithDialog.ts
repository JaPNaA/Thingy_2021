import { Rectangle } from "../engine/util/Rectangle";
import { dialogFetcher } from "../resources/dialogFetcher";
import { NPCDialog } from "../ui/NPCDialog";
import { NPC } from "./NPC";

export class NPCWithDialog extends NPC {
    private npcDialog?: NPCDialog;
    private loadingDialog = false;

    public canStartDialog() {
        return !this.loadingDialog && (!this.npcDialog || this.npcDialog.closed);
    }

    public startDialog() {
        if (!this.canStartDialog()) { return; }

        this.loadingDialog = true;

        dialogFetcher.fetch("testDialog").then(dialog => {
            this.npcDialog = new NPCDialog(dialog, new Rectangle(this.rect.x, this.rect.y, 500, 300));
            this.world.addElm(this.npcDialog);
            this.loadingDialog = false;
        });
    }

    public dispose() {
        super.dispose();
        if (this.npcDialog && !this.npcDialog.closed) {
            this.world.removeElm(this.npcDialog);
        }
    }
}
