import Entity from "../Entity";
import Drop from "./Drop";
import { FROM_TABLE, MOB_RARITY_MULTIPLIER, MOB_SIZE_MULTIPLIER } from "../../consts/Helpers.js";
import Arena, { SpawnZone } from "../../game/Arena";
import { HealthComponent, MobComponent } from "../Components";
import AI from "./mob-behavior/AI";
import Player from "../player/Player";
import Petal from "../player/Petal";
import { MobDefinition } from "../../consts/MobDefinitions";
//TODO: AI
export default class Mob extends Entity {
    passiveSpeed = 4; //in bursts
    aggroSpeed = 2;
    zone: SpawnZone;
    lastIdle = -1;
    loot: Record<number, number[][]>;
    health: HealthComponent;
    mob: MobComponent;
    ai: AI;

    constructor(arena: Arena, zone: SpawnZone, x: number, y: number, angle: number, rarity: number, mobDefinition: MobDefinition) {
        super(arena, x, y, mobDefinition.size * MOB_SIZE_MULTIPLIER[rarity], angle);
        this.zone = zone;
        this.health = new HealthComponent(this, mobDefinition.health * MOB_RARITY_MULTIPLIER[rarity]);
        this.mob = new MobComponent(this, mobDefinition.id, rarity);
        this.damage = mobDefinition.damage * MOB_RARITY_MULTIPLIER[rarity];
        this.loot = mobDefinition.loot;
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
    onCollide(ent: Entity) {
        if ((ent.playerInfo || ent.petal) && this._arena._tick - this.health.lastDamaged > 2) {
            if (ent instanceof Player) this.ai.onDamage(ent);
            else if (ent instanceof Petal) this.ai.onDamage(ent.player);
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
        const drops: Array<[number, number]> = [];
        for (const id of Object.keys(this.loot)) {
            const rar = FROM_TABLE(this.loot[parseInt(id)][this.mob.rarity]);
            if (rar) drops.push([parseInt(id), rar - 1]);
        }
        for (let n = 0; n < drops.length; ++n) {
            this._arena.add(new Drop(this._arena, this.pos.x, this.pos.y, 40, 2 * n * Math.PI / drops.length, {
                id: drops[n][0],
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