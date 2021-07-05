import { CollisionReactionMap } from "../engine/collision/CollisionReactionMap";
import { Hitbox } from "../engine/collision/Hitbox";
import { Entity } from "./Entity";

export const collisions = {
    types: {
        static: Symbol(),
        moving: Symbol()
    }
};

export function registerCollisions(collisionReactionMap: CollisionReactionMap) {
    collisionReactionMap.setCollisionReaction(
        collisions.types.moving, collisions.types.static,
        function (moving: Hitbox<Entity>, block: Hitbox<Entity>) {
            // modified from https://stackoverflow.com/a/29861691
            const dx = (moving.rectangle.x + moving.rectangle.width / 2)
                - (block.rectangle.x + block.rectangle.width / 2);
            const dy = (moving.rectangle.y + moving.rectangle.height / 2)
                - (block.rectangle.y + block.rectangle.height / 2);
            const avgWidth = (moving.rectangle.width + block.rectangle.width) / 2;
            const avgHeight = (moving.rectangle.height + block.rectangle.height) / 2;
            const crossWidth = avgWidth * dy;
            const crossHeight = avgHeight * dx;

            if (crossWidth > crossHeight) {
                if (crossWidth > -crossHeight) {
                    // collision at bottom of block
                    moving.rectangle.y = block.rectangle.y + block.rectangle.height;
                } else {
                    // collision at left of block
                    moving.rectangle.x = block.rectangle.x - moving.rectangle.width;
                }
            } else {
                if (crossWidth > -crossHeight) {
                    // collision at right of block
                    moving.rectangle.x = block.rectangle.x + block.rectangle.width;
                } else {
                    // collision at top of block
                    moving.rectangle.y = block.rectangle.y - moving.rectangle.height;
                }
            }
        }
    );
}
