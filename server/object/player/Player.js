import { Entity } from "../Entity.js";
import { Mob } from "../mob/Mob.js";

export class Player extends Entity {
    constructor(arena, x, y, r, camera) {
        super(arena, x, y, r, 0);
        this.owner = camera;
        this.inventory = [];
        this.health = {
            health: 100,
            maxHealth: 100
        }
        this.style = {
            color: 0
        }
        this.damage = 25;
    }
    tick() {
        const x = (this.owner.input & 1) - ((this.owner.input >> 2) & 1),
        y = ((this.owner.input >> 1) & 1) - ((this.owner.input >> 3) & 1);
        const scale = (x&&y? Math.SQRT1_2: x||y?1:0) * 0.4; //sets player speed
        this.accel.set(x,y);
        this.accel.scale(scale);
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this) continue;
            if (ent instanceof Mob) {
                if (this.arena.server.tick - this.lastDamaged > 8) {
                    this.health.health -= ent.damage;
                    this.lastDamaged = this.arena.server.tick;
                    if (this.health.health < 0.0001) {
                        this.owner.player = null;
                        this.delete();
                    }
                }
                this.vel.scale(-1); //actual collision
            }
        }
        super.tick();
    }
}