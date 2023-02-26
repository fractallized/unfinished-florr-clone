import Entity from "../Entity";
import Drop from "../mob/Drop";
import Mob from "../mob/Mob";
import Petal from "./Petal";
import PETAL_DEFINITIONS, { PetalDefinition } from "../../consts/PetalDefinitions";
import Client from "../Client";
import Arena from "../../game/Arena";
import { HealthComponent, PlayerInfoComponent } from "../Components";

interface PlayerPetal {
    id: number,
    rarity: number,
    petal: Petal | null,
    cdTick: number,
    cooldown: number,
    definition: PetalDefinition
}

export default class Player extends Entity {
    static BASE_ROTATION_SPEED = 0.1;
    static BASE_DAMAGE = 25;
    static BASE_HEALTH = 100;

    numSpacesAlloc = 10;
    collectionRadius = 2000;
    damage = Player.BASE_DAMAGE;
    rotationAngle = 0;
    rotationSpeed = Player.BASE_ROTATION_SPEED;
    isFriendly = true;
    owner: Client;
    creationTick: number;
    health: HealthComponent = new HealthComponent(this, Player.BASE_HEALTH);
    playerInfo: PlayerInfoComponent = new PlayerInfoComponent(this); 
    equipped: PlayerPetal[][] = new Array(10).fill(0).map(_ => []);

    constructor(arena: Arena, x: number, y: number, r: number, camera: Client) {
        super(arena, x, y, r, 0);
        this.owner = camera;
        this.owner.player = this;
        this.creationTick = this._arena._tick;
        this.initLoadout();
    }
    initLoadout() {
        this.playerInfo.numEquipped = this.owner.numEquipped;
        this.numSpacesAlloc = 0;
        const equipped = this.owner.equipped;
        if (!equipped) return;
        for (let n = 0; n < this.owner.numEquipped * 2; ++n) {
            this.changePetal(n, equipped[n * 2], equipped[n * 2 + 1]);
        }
    }
    calculateSpecials() {
        this.playerInfo.faceFlags &= ~16;
        this.owner.camera.fov = 1; //Client.BASE_FOV
        this.rotationSpeed = Player.BASE_ROTATION_SPEED;
        for (let outer = 0; outer < this.playerInfo.numEquipped; ++outer) {
            const innerLength = this.equipped[outer].length;
            for (let inner = 0; inner < innerLength; ++inner) {
                const petal = this.equipped[outer][inner];
                if (petal.definition.fovMultiplier) {
                    this.playerInfo.faceFlags |= 1 << 4; 
                    this.owner.camera.fov = Math.min(this.owner.camera.fov, 1 * petal.definition.fovMultiplier[petal.rarity]);
                } 
                petal.definition.rotationSpeedAddition && (this.rotationSpeed += petal.definition.rotationSpeedAddition[petal.rarity] * 0.04);
            }
        }
    }
    changePetal(pos: number, id: number, rarity: number) {
        if (pos >= 20) return;
        this.owner.equipped[pos * 2] = id;
        this.owner.equipped[pos * 2 + 1] = rarity;
        this.playerInfo.petalsEquipped.set(pos * 2, id);
        this.playerInfo.petalsEquipped.set(pos * 2 + 1, rarity);
        if (pos >= this.owner.numEquipped) return;
        if (this.equipped[pos].length !== 0) {
            if (this.equipped[pos][0].definition.noSpawn) this.numSpacesAlloc -= 0;
            else if (this.equipped[pos][0].definition.clump) --this.numSpacesAlloc;
            else this.numSpacesAlloc -= this.equipped[pos].length | 0;
            for (const petalInfo of this.equipped[pos]) if (petalInfo.petal) petalInfo.petal.delete();
            this.equipped[pos] = [];
        }
        if (id === 0) return this.calculateSpecials();
        const definition = PETAL_DEFINITIONS[id];
        const repeat = definition.repeat ? definition.repeat[rarity]: 1;
        for (let n = 0; n < repeat; n++) {
            if (definition.noSpawn) {
                this.equipped[pos].push({
                    id: 0,
                    rarity,
                    petal: null,
                    cdTick: 0,
                    cooldown: 1,
                    definition
                });
                continue;
            }
            this.equipped[pos].push({
                id,
                rarity,
                petal: null,
                cdTick: 0,
                cooldown: definition.cooldown,
                definition
            });
            if (n === 0 || !definition.clump) ++this.numSpacesAlloc;
        }
        this.calculateSpecials();
    }
    onPetalLoss(outerPos: number, innerPos: number) {
        this.equipped[outerPos][innerPos].petal = null;
        this.equipped[outerPos][innerPos].cdTick = 0;
    }
    petalHandle() {
        let rotPos = -1;
        for (let outer = 0; outer < this.playerInfo.numEquipped; ++outer) {
            const innerLength = this.equipped[outer].length;
            let healthSum = 0, minCD = 1;
            for (let inner = 0; inner < innerLength; ++inner) {
                const petal = this.equipped[outer][inner];
                if (petal.id === 0 || petal.definition.noSpawn) continue;
                if (!petal.definition.clump || inner === 0) ++rotPos;
                if (petal.cdTick < petal.cooldown) ++petal.cdTick;
                else if (!petal.petal) {
                    petal.petal = new (petal.definition.petal)(this._arena, this, outer, inner, rotPos, petal.rarity, petal.definition)
                    this._arena.add(petal.petal);
                } else {
                    healthSum += petal.petal.health.health / petal.petal.health.maxHealth;
                    petal.petal.rotationPos = rotPos;
                }
                minCD = Math.min(minCD, petal.cdTick / petal.cooldown);
            }
            this.playerInfo.petalHealths.set(outer, (healthSum / innerLength) * 255);
            this.playerInfo.petalCooldowns.set(outer, minCD * 255);
        }
    }
    tick() {
        if (this.owner.ws.readyState === 3) {
            this.delete();
            return super.tick();
        }
        if (this.pendingDelete) return super.tick();
        //this.playerInfo.faceFlags = this.owner.input;
        this.petalHandle();
        this.rotationAngle += this.rotationSpeed;
        const input = this.owner.input.input;
        const x = (input & 1) - ((input >> 2) & 1),
        y = ((input >> 1) & 1) - ((input >> 3) & 1);
        if (x || y) {
            this.playerInfo.faceFlags &= ~7;
            if (x === 1) {
                if (y === 1) this.playerInfo.faceFlags |= 1;
                else if (y === -1) this.playerInfo.faceFlags |= 7;
                else this.playerInfo.faceFlags |= 0;
            } else if (x === 0) this.playerInfo.faceFlags |= 4 - 2 * y;
            else {
                if (y === 1) this.playerInfo.faceFlags |= 3;
                else if (y === -1) this.playerInfo.faceFlags |= 5;
                else this.playerInfo.faceFlags |= 4; 
            }
        }
        const scale = (x&&y? Math.SQRT1_2: x||y?1:0) * 2; //sets player speed
        this.accel.set(x, y);
        this.accel.scale(scale);
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this) continue;
            if (ent instanceof Petal) continue;
            if (ent instanceof Drop) {
                if (ent.collectedBy) continue;
                if (this.pos.distanceSq(ent.pos) > (this.collectionRadius + ent.pos.radius) ** 2) continue;
                ent.collectedBy = this;
                continue;
            }
            if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2) continue;
            this.collideWith(ent);
        }
        super.tick();
    }
    getCollisions() { 
        const collisions = new Set<Entity>();
        const possibleCollisions = this._arena.collisionGrid.getEntityCollisions(this, this.collectionRadius);
        for (const entity of possibleCollisions) if (entity.canCollide && !entity.pendingDelete) collisions.add(entity);
        return collisions;
    }
    onCollide(ent: Entity) {
        if (this._arena._tick - this.creationTick < 50) return;
        if (ent.isFriendly !== this.isFriendly) {
            if (this._arena._tick - this.health.lastDamaged > 2) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena._tick;
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
        }
        this.pendingDelete = true;
        super.delete();
    }
}