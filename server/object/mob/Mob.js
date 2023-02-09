import { Entity } from "../Entity.js";
import { Player } from "../player/Player.js";

export class Mob extends Entity {
    constructor(arena, x, y, r, angle, id, aggroLevel) {
        super(arena, x, y, r, angle);
        this.friction = 0.97;
        this.mobID = id;
        this.aggro = false;
        this.aggroLevel = aggroLevel;
        this.lastIdle = arena.server.tick - 100;
        this.health = {
            health: 200,
            maxHealth: 250
        }
        this.damage = 10;
        this.style = {
            color: 1
        }
    }
    tick() {
        if (this.arena.server.tick - this.lastIdle > 100) {
            if (Math.random() < 0.05) {
                this.angle = Math.random() * 2 * Math.PI;
                this.vel.set(Math.cos(this.angle) * 8, Math.sin(this.angle) * 8);
                this.lastIdle = this.arena.server.tick;
            }
        }
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this) continue;
            if (ent instanceof Player) {
                if (this.arena.server.tick - this.lastDamaged > 8) {
                    this.health.health -= ent.damage;
                    this.lastDamaged = this.arena.server.tick;
                    if (this.health.health < 0.0001) this.delete();
                }
                this.vel.scale(-1);
            }
        }
        super.tick();
    }
}