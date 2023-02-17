import { FROM_OBJECT_TABLE, FROM_TABLE } from "../coder/Helpers.js";
import { MOB_DEFINITIONS } from "../MobDefinitions.js";
import { COMPONENTS } from "../object/Components.js";
import { Portal } from "../object/map/Portal.js";
import { Mob } from "../object/mob/Mob.js";
import { SpatialHash } from "./Collisions.js";

export class Arena {
    state = 2; // create
    constructor(server, x, y, serverID, name = '') {
        this.server = server;
        this.serverID = serverID;
        this.arena = new COMPONENTS.ArenaComponent(this, x, y, name);
        this.id = 0;
        this.entities = {};
        this.clients = {};
        this.deletions = {};
        this.collisionGrid = new SpatialHash(this);
        this.zones = [];
        this._tick = 0;
    }
    tick() {
        this.state = 0;
        const entities = Object.values(this.entities);
        const clients = Object.values(this.clients);
        const deletions = Object.values(this.deletions);
        for (const client of clients) client.tick();
        for (const entity of entities) { entity.wipeState(); entity.tick(); }
        for (const deletion of deletions) deletion.deleteAnimation.tick();
        for (const zone of this.zones) zone.tick();
        ++this._tick;
    }
    calculateOpenHash() {
        for (let n = 1; n < 16384; ++n) if (!this.entities[n] && !this.deletions[n]) return n;
        return 16384;
    }
    calculateClientHash() {
        for (let n = 16384; n < 32768; ++n) if (!this.clients[n]) return n;
        return 32768;
    }
    addClient(entity) {
        const hash = this.calculateClientHash();
        this.clients[hash] = (entity);
        entity.id = hash;
        return entity;
    }
    add(entity) {
        const hash = this.calculateOpenHash();
        this.entities[hash] = (entity);
        entity.id = hash;
        entity.gridHash = this.collisionGrid.insert(entity);
        return entity;
    }
    addPortal(entity) {
        const hash = this.calculateOpenHash();
        this.entities[hash] = (entity);
        entity.id = hash;
        return entity;
    }
    removeFromActive(entity) {
        entity.isDeleted = true;
        delete this.entities[entity.id];
        this.deletions[entity.id] = entity;
    }
    delete(entity) {
        delete this.deletions[entity.id];
    }
    removeClient(client) {
        delete this.clients[client.id];
    }
    setZones(...zones) {
        for (const zone of zones) this.zones.push(new SpawnZone(this, ...zone));
        return this;
    }
    setPortals(...portals) {
        for (const portal of portals) this.addPortal(new Portal(this, ...portal));
        return this;
    }
}
export class SpawnZone {
    constructor(arena, x, y, w, h, spawnTable) {
        this.arena = arena;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.spawnTable = spawnTable;
        this.mobCount = 0;
        this.lastSpawned = 0;
    }
    tick() {
        if (this.mobCount > 8) return;
        if ((this.arena.server.tick - this.lastSpawned) & 7) return; 
        if (Math.random() < this.spawnTable.BASE_CHANCE) {
            const potentialX = this.x + Math.random() * this.width;
            const potentialY = this.y + Math.random() * this.height;
            const id = FROM_OBJECT_TABLE(this.spawnTable.MOB_CHANCE);
            const rarity = FROM_TABLE(this.spawnTable.RARITY_CHANCE);
            if (this.arena.collisionGrid.getCollisions(potentialX, potentialY, 100, 100).length) return;
            const ent = new Mob(this.arena, this, potentialX, potentialY, 2 * Math.PI * Math.random(), rarity, MOB_DEFINITIONS[id]);
            this.arena.add(ent);
            ++this.mobCount;
        }
    }
}