import { CollisionReactionMap } from "../engine/collision/CollisionReactionMap";
import { Hitbox } from "../engine/collision/Hitbox";
import { isRectanglesColliding } from "../engine/collision/isRectanglesColliding";
import { MovingRectangle } from "../engine/util/MovingRectangle";
import { Rectangle } from "../engine/util/Rectangle";
import { Entity } from "./Entity";
import { TileMap } from "./TileMap";

export const collisions = {
    types: {
        static: Symbol(),
        moving: Symbol(),
        map: Symbol()
    }
};

export function registerCollisions(collisionReactionMap: CollisionReactionMap) {
    collisionReactionMap.setCollisionReaction(
        collisions.types.moving, collisions.types.static,
        function (moving: Hitbox<Entity>, block: Hitbox<Entity>) {
            handleMovingStaticCollision(moving.rectangle, block.rectangle);
        }
    );

    collisionReactionMap.setCollisionReaction(
        collisions.types.map, collisions.types.moving,
        function (map: Hitbox<TileMap>, moving: Hitbox<Entity>) {
            const closestBlocks = map.elm.getCollisionTiles(
                moving.rectangle.x + moving.rectangle.width / 2,
                moving.rectangle.y + moving.rectangle.height / 2
            );
            if (!closestBlocks) { return; }

            for (const block of closestBlocks) {
                if (isRectanglesColliding(block, moving.rectangle)) {
                    handleMovingStaticCollision(moving.rectangle, block);
                }
            }
        }
    )
}

function handleMovingStaticCollision(moving: Rectangle, block: Rectangle) {
    // modified from https://stackoverflow.com/a/29861691
    let dx, dy;
    if (moving instanceof MovingRectangle) {
        dx = (moving.lastX + moving.width / 2)
            - (block.x + block.width / 2);
        dy = (moving.lastY + moving.height / 2)
            - (block.y + block.height / 2);
    } else {
        dx = (moving.x + moving.width / 2)
            - (block.x + block.width / 2);
        dy = (moving.y + moving.height / 2)
            - (block.y + block.height / 2);
    }

    const avgWidth = (moving.width + block.width) / 2;
    const avgHeight = (moving.height + block.height) / 2;
    const crossWidth = avgWidth * dy;
    const crossHeight = avgHeight * dx;

    if (crossWidth > crossHeight) {
        if (crossWidth > -crossHeight) {
            // collision at bottom of block
            moving.y = block.y + block.height;
        } else {
            // collision at left of block
            moving.x = block.x - moving.width;
        }
    } else {
        if (crossWidth > -crossHeight) {
            // collision at right of block
            moving.x = block.x + block.width;
        } else {
            // collision at top of block
            moving.y = block.y - moving.height;
        }
    }
}
