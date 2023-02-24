import Entity from "../Entity.js";
import Drop from "./Drop.js";
import COMPONENTS from "../Components.js";
import { FROM_TABLE, MOB_RARITY_MULTIPLIER, MOB_SIZE_MULTIPLIER } from "../../coder/Helpers.js";
//TODO: AI
export default class Mob extends Entity {
    passiveSpeed = 4; //in bursts
    aggroSpeed = 2;
    constructor(arena, zone, x, y, angle, rarity, mobDefinition) {
        super(arena, x, y, mobDefinition.size * MOB_SIZE_MULTIPLIER[rarity], angle);
        this.zone = zone;
        this.style.color = 1;
        this.health = new COMPONENTS.HealthComponent(this, mobDefinition.health * MOB_RARITY_MULTIPLIER[rarity]);
        this.mob = new COMPONENTS.MobComponent(this, mobDefinition.id, rarity);
        this.damage = mobDefinition.damage * MOB_RARITY_MULTIPLIER[rarity];
        this.lastIdle = -1;
        this.loot = mobDefinition.loot;
        this.angle = angle;
        this.ai = new (mobDefinition.AI(rarity))(this);
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        this.ai.tick(); //sets changes in acceleration and angle as well
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this) continue;
            if (ent instanceof Drop) continue;
            if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2) continue;
            this.collideWith(ent);
        }
        super.tick();
    }
    onCollide(ent) {
        if ((ent.playerInfo || ent.petal) && this._arena._tick - this.health.lastDamaged > 2) {
            if (ent.playerInfo) this.ai.onDamage(ent);
            else this.ai.onDamage(ent.player);
            this.health.health -= ent.damage;
            this.health.lastDamaged = this._arena._tick;
        }
        if (this.health.health < 0.0001) { 
            this.health.health = 0;
            this.delete();
        }
    }
    delete() {
        if (this.pendingDelete) return;
        --this.zone.mobCount;
        const drops = [];
        for (const [id, table] of Object.entries(this.loot)) {
            const rar = FROM_TABLE(table[this.mob.rarity]);
            if (rar) drops.push([id, rar - 1]);
        }
        for (let n = 0; n < drops.length; ++n) {
            this._arena.add(new Drop(this._arena, this.pos.x, this.pos.y, 40, 2 * n * Math.PI / drops.length, {
                id: parseInt(drops[n][0]),
                rarity: drops[n][1]
            }));
        }
        return super.delete();
    }
    wipeState() {
        this.health.reset();
        this.mob.reset();
        super.wipeState();
    }
}