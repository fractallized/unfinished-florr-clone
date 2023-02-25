import Arena from "../game/Arena";
import Client from "./Client";
import { StyleComponent } from "./Components";
import Entity from "./Entity";
import Player from "./player/Player.js";
export default class Portal extends Entity {
    canCollide = false;
    _arena: Arena;
    sX: number;
    sY: number;
    to: number;
    constructor(arena: Arena, def: number[]) {
        super(arena, def[0], def[1], 50, 0);
        this.sX = def[2];
        this.sY = def[3];
        this._arena = arena;
        
        this.style = new StyleComponent(this, 0, 1);
        this.to = def[4];
    }
    tick() {
        const collisions = this._arena.collisionGrid.getEntityCollisions(this);
        for (const ent of collisions) {
            if (ent instanceof Player) {
                if (!(ent.owner instanceof Client)) continue;
                if (this._arena.server.tick - ent.owner.enteredPortalTick < 100) continue;
                if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2) continue;
                ent.owner.moveServer(this.to, this.sX, this.sY);
            }
        }
    }
    wipeState() {}
}