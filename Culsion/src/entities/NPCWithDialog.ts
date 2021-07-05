import { NPCDialog } from "../ui/NPCDialog";
import { NPC } from "./NPC";

export class NPCWithDialog extends NPC {
    private dialogOpen = false;

    onCollision() {
        if (this.dialogOpen) { return; }
        this.dialogOpen = true;

        this.world.addElm(new NPCDialog(["こら！"]));
    }
}
