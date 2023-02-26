import { FROM_OBJECT_TABLE, FROM_TABLE } from "../consts/Helpers.js";
import MOB_DEFINITIONS from "../consts/MobDefinitions.js";
import Portal from "../object/Portal.js";
import Mob from "../object/mob/Mob.js";
import SpatialHash from "./Collisions.js";
import GameServer from "./Server.js";
import Entity from "../object/Entity.js";
import Client from "../object/Client.js";
import AbstractEntity from "../object/AbstractEntity.js";
import { ArenaComponent } from "../object/Components.js";

export default class Arena extends AbstractEntity {
    server: GameServer
    serverID: number;
    arena: ArenaComponent;
    entities: Map<number, Entity>;
    clients: Map<number, Client>;
    collisionGrid = new SpatialHash();
    zones: SpawnZone[] = [];
    _tick = 0;
    constructor(server: GameServer, x: number, y: number, serverID: number, name = '') {
        super();
        this.server = server;
        this.serverID = serverID;
        this.arena = new ArenaComponent(this, x, y, name);
        this.id = 1; //RULE: MUST NOT BE 0
        this.entities = new Map();
        this.clients = new Map();
    }
    tick() {
        const start = performance.now();
        this.state = 0;
        const entities = this.entities.values();
        const clients = this.clients.values();
        for (const client of clients) client.tick();
        for (const entity of entities) entity.wipeState();
        for (const entity of this.entities.values()) entity.tick();
        for (const zone of this.zones) zone.tick();
        ++this._tick;
        console.log(performance.now() - start + "ms tick, looped " + this.entities.size + " entities");
    }
    calculateOpenHash() {
        for (let n = 2; n < 16384; ++n) if (!this.entities.get(n)) return n;
        return 16384;
    }
    calculateClientHash() {
        for (let n = 16384; n < 32768; ++n) if (!this.clients.get(n)) return n;
        return 32768;
    }
    addClient(entity: Client) {
        const hash = this.calculateClientHash();
        this.clients.set(hash, entity);
        entity.id = hash;
        return entity;
    }
    add(entity: Entity) {
        const hash = this.calculateOpenHash();
        this.entities.set(hash, entity);
        entity.id = hash;
        this.collisionGrid.insert(entity);
        return entity;
    }
    removeFromActive(entity: Entity) {
        entity.canCollide = false;
    }
    remove(entity: Entity) {
        entity.state = 4;
        entity.isDeleted = true;
        this.collisionGrid.remove(entity);
        this.entities.delete(entity.id);
    }
    removeClient(client: Client) {
        this.clients.delete(client.id);
    }
    setZones(zones: SpawnZoneDefinition[]) {
        for (const zone of zones) this.zones.push(new SpawnZone(this, zone));
        return this;
    }
    setPortals(portals: number[][]) {
        for (const portal of portals) this.add(new Portal(this, portal));
        return this;
    }
}
interface SpawnZoneDefinition {
    x: number,
    y: number,
    w: number,
    h: number,
    spawnTable: {
        BASE_CHANCE: number,
        RARITY_CHANCE: number[],
        MOB_CHANCE: Record<number, number>,
        MOB_CAP?: number
    }
}
export class SpawnZone {
    arena: Arena;
    MOB_CAP = 0;
    x: number;
    y: number;
    width: number;
    height: number;
    spawnTable: any; //fix
    mobCount = 0;
    lastSpawned = -100;
    constructor(arena: Arena, definition: SpawnZoneDefinition) {
        this.arena = arena;
        this.x = definition.x;
        this.y = definition.y;
        this.width = definition.w;
        this.height = definition.h;
        this.spawnTable = definition.spawnTable;
        this.MOB_CAP = definition.spawnTable.MOB_CAP || 8;
    }
    tick() {
        if (this.mobCount > this.MOB_CAP) return;
        if (Math.random() < this.spawnTable.BASE_CHANCE) {
            const potentialX = this.x + Math.random() * this.width;
            const potentialY = this.y + Math.random() * this.height;
            const id = FROM_OBJECT_TABLE(this.spawnTable.MOB_CHANCE);
            const rarity = FROM_TABLE(this.spawnTable.RARITY_CHANCE);
            const ent = new Mob(this.arena, this, potentialX, potentialY, 2 * Math.PI * Math.random(), rarity, MOB_DEFINITIONS[id]);
            if (this.arena.collisionGrid.getEntityCollisions(ent).size) return;
            this.arena.add(ent);
            ++this.mobCount;
        }
    }
}