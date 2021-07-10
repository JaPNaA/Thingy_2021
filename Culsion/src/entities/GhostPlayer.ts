import { collisions } from "./collisions";
import { Player } from "./Player";

export class GhostPlayer extends Player {
    public collisionType = collisions.types.none;
}
