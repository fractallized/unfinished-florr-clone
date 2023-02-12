import { MOB_DEFINITIONS } from "../MobDefinitions.js";
import { Mob } from "../object/mob/Mob.js";
import { SpatialHash } from "./Collisions.js";

export class Arena {
    constructor(server, x, y, name = '') {
        this.server = server;
        this.width = x;
        this.height = y;
        this.arena = {
            width: x,
            height: y,
            name: ''
        }
        this.id = 0;
        this.entities = {};
        this.clients = {};
        this.deletions = {};
        this.collisionGrid = new SpatialHash(this);
        this.zones = [new SpawnZone(this,0,0,1000,1000,{})]; //test
    }
    tick() {
        const entities = Object.values(this.entities);
        const clients = Object.values(this.clients);
        const deletions = Object.values(this.deletions);
        for (const entity of entities) entity.tick();
        for (const client of clients) client.tick();
        for (const deletion of deletions) deletion.deleteAnimation.tick();
        for (const zone of this.zones) zone.tick();
    }
    calculateOpenHash() {
        for (let n = 1; n < 16384; n++) if (!this.entities[n] && !this.deletions[n]) return n;
        return 16384;
    }
    calculateClientHash() {
        for (let n = 16384; n < 32768; n++) if (!this.clients[n]) return n;
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
    removeFromActive(entity) {
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
        for (const zone of zones) {
            this.zones.push(new SpawnZone(this, ...zone));
        }
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
    }
    tick() {
        if (Math.random() < 0.005 && Object.keys(this.arena.entities).length < 64) {
            const potentialX = this.x + Math.random() * this.width;
            const potentialY = this.y + Math.random() * this.height;
            const ent = new Mob(this.arena, potentialX, potentialY, 20, 2 * Math.PI * Math.random(), 0, MOB_DEFINITIONS[Math.random() * 2 | 0]);
            this.arena.add(ent);
        }
    }
}