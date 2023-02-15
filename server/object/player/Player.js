import { Entity } from "../Entity.js";
import { Drop } from "../mob/Drop.js";
import { Mob } from "../mob/Mob.js";
import { COMPONENTS } from "../Components.js";
import { Petal } from "./Petal.js";
import { PETAL_DEFINITIONS } from "../../PetalDefinitions.js";
import { HealPetal } from "./HealPetal.js";

export class Player extends Entity {
    static BASE_ROTATION_SPEED = 0.1;

    collectionRadius = 25;
    damage = 25;
    rotationAngle = 0;

    constructor(arena, x, y, r, camera) {
        super(arena, x, y, r, 0);
        this.owner = camera;
        this.owner.player = this;

        this.health = new COMPONENTS.HealthComponent(this, 100);
        this.playerInfo = new COMPONENTS.PlayerInfoComponent(this, [...this.owner.equipped]); 

        this.equipped = new Array(10).fill([]); //ACCOUNTS FOR PETALS THAT SPAWN MULTIPLE
        this.getAdjustedEquipped();
    }
    getAdjustedEquipped() {
        this.playerInfo.numEquipped = this.owner.numEquipped;
        this.numSpacesAlloc = 0;
        const equipped = this.playerInfo.petalsEquipped;
        if (!equipped) return;
        for (let n = 0; n < this.owner.numEquipped; ++n) {
            this.equipped[n] = [];
            if (equipped[n * 2]) {
                this.equipped[n].push({
                    id: equipped[n * 2],
                    rarity: equipped[n * 2 + 1],
                    petal: null,
                    cdTick: 0,
                    cooldown: PETAL_DEFINITIONS[equipped[n * 2]].cooldown
                });
                ++this.numSpacesAlloc;
            } else {
                this.equipped[n] = [{
                    id: 0,
                    petal: null
                }];
            }
        }
    }
    changePetal(pos, id, rarity) {
        if (pos >= this.numEquipped) return;
        this.numSpacesAlloc -= this.equipped[pos].length | 0;
        for (const petalInfo of this.equipped[pos]) if (petalInfo.petal) petalInfo.petal.delete();
        this.equipped[pos] = [];
        const equipped = this.playerInfo.petalsEquipped;
        if (id) {
            this.equipped[pos].push({
                id,
                rarity,
                petal: null,
                cdTick: 0,
                cooldown: PETAL_DEFINITIONS[equipped[pos * 2]].cooldown
            });
            ++this.numSpacesAlloc;
        } else {
            this.equipped[pos] = [{
                id: 0,
                petal: null
            }];
        }
        this.playerInfo.petalsEquipped[pos << 1] = id;
        this.playerInfo.petalsEquipped[(pos << 1) + 1] = rarity;
    }
    onPetalLoss(outerPos, innerPos) {
        this.equipped[outerPos][innerPos].petal = null;
        this.equipped[outerPos][innerPos].cdTick = 0;
    }
    petalHandle() {
        let rotPos = -1;
        for (let outer = 0; outer < this.playerInfo.numEquipped; ++outer) {
            const innerLength = this.equipped[outer].length;
            let healthSum = 0, cdSum = 0;
            for (let inner = 0; inner < innerLength; ++inner) {
                const petal = this.equipped[outer][inner];
                if (petal.id === 0) continue;
                ++rotPos;
                if (petal.cdTick < petal.cooldown) ++petal.cdTick;
                else if (!petal.petal) {
                    if (PETAL_DEFINITIONS[petal.id].petal === 'Petal') petal.petal = this._arena.add(new Petal(this._arena, this, this.pos.x, this.pos.y, outer, inner, rotPos, this.playerInfo.petalsEquipped[2*outer+1], PETAL_DEFINITIONS[petal.id]))
                    else if (PETAL_DEFINITIONS[petal.id].petal === 'HealPetal') petal.petal = this._arena.add(new HealPetal(this._arena, this, this.pos.x, this.pos.y, outer, inner, rotPos, this.playerInfo.petalsEquipped[2*outer+1], PETAL_DEFINITIONS[petal.id]))
                } else healthSum += petal.petal.health.health / petal.petal.health.maxHealth;
                cdSum += petal.cdTick / petal.cooldown;
            }
            this.playerInfo.petalHealths[outer] = (healthSum / innerLength) * 255;
            this.playerInfo.petalCooldowns[outer] = (cdSum / innerLength) * 255;
        }
    }
    tick() {
        if (this.owner.ws.readyState === 3) return this.delete();
        this.petalHandle();
        this.rotationAngle += Player.BASE_ROTATION_SPEED;
        const x = (this.owner.input & 1) - ((this.owner.input >> 2) & 1),
        y = ((this.owner.input >> 1) & 1) - ((this.owner.input >> 3) & 1);
        const scale = (x&&y? Math.SQRT1_2: x||y?1:0) * 2; //sets player speed
        this.accel.set(x, y);
        this.accel.scale(scale);
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this) continue;
            if (ent instanceof Petal) continue;
            if (ent instanceof Drop) {
                if (this.pos.distanceSq(ent.pos) > (this.collectionRadius + ent.pos.radius) ** 2) continue;
                ent.collectedBy = this;
                continue;
            }
            if (ent.pendingDelete) continue;
            if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2) continue;
            this.collideWith(ent);
        }
        super.tick();
    }
    getCollisions() { return this._arena.collisionGrid.getEntityCollisions(this, this.collectionRadius); }
    onCollide(ent) {
        if (ent instanceof Mob) {
            if (this._arena.server.tick - this.health.lastDamaged > 2) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena.server.tick;
            }
        }
        if (this.health.health < 0.0001) {
            this.health.health = 0;
            this.delete();
        }
    }
    delete() {
        if (this.owner.player === this) {
            this.owner.player = null;
            this.owner.camera.player = -1;
            this.pendingDelete = true;
        }
        super.delete();
    }
    wipeState() {
        this.playerInfo.reset();
        this.health.reset();
        super.wipeState();
    }
}