import { Client } from "./Client.js";
import { COMPONENTS } from "./Components.js";
import { Player } from "./player/Player.js";
export class Portal {
    canCollide = false;
    
    constructor(arena, x, y, to, spawnX, spawnY) {
        this.sX = spawnX;
        this.sY = spawnY;
        this._arena = arena;
        this.pos = new COMPONENTS.PositionComponent(this, x, y, 0, 50);
        this.style = new COMPONENTS.StyleComponent(this, 0, 1);
        this.to = to;
    }
    tick() {
        const collisions = this._arena.collisionGrid.getEntityCollisions(this);
        for (const ent of collisions) {
            if (!(ent instanceof Player)) continue;
            if (!(ent.owner instanceof Client)) continue;
            if (this._arena.server.tick - ent.owner.enteredPortalTick < 100) continue;
            if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2) continue;
            ent.owner.moveServer(this.to, this.sX, this.sY);
        }
    }
    wipeState() {}
}