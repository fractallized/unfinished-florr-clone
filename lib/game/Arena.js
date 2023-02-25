"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnZone = void 0;
const Helpers_js_1 = require("../coder/Helpers.js");
const MobDefinitions_js_1 = __importDefault(require("./MobDefinitions.js"));
const Portal_js_1 = __importDefault(require("../object/Portal.js"));
const Mob_js_1 = __importDefault(require("../object/mob/Mob.js"));
const Collisions_js_1 = __importDefault(require("./Collisions.js"));
const AbstractEntity_js_1 = __importDefault(require("../object/AbstractEntity.js"));
const Components_js_1 = require("../object/Components.js");
class Arena extends AbstractEntity_js_1.default {
    constructor(server, x, y, serverID, name = '') {
        super();
        this.collisionGrid = new Collisions_js_1.default();
        this.zones = [];
        this._tick = 0;
        this.server = server;
        this.serverID = serverID;
        this.arena = new Components_js_1.ArenaComponent(this, x, y, name);
        this.id = 0;
        this.entities = new Map();
        this.clients = new Map();
    }
    tick() {
        this.state = 0;
        const entities = this.entities.values();
        const clients = this.clients.values();
        for (const client of clients)
            client.tick();
        for (const entity of entities)
            entity.wipeState();
        for (const entity of this.entities.values())
            entity.tick();
        for (const zone of this.zones)
            zone.tick();
        ++this._tick;
    }
    calculateOpenHash() {
        for (let n = 1; n < 16384; ++n)
            if (!this.entities.get(n))
                return n;
        return 16384;
    }
    calculateClientHash() {
        for (let n = 16384; n < 32768; ++n)
            if (!this.clients.get(n))
                return n;
        return 32768;
    }
    addClient(entity) {
        const hash = this.calculateClientHash();
        this.clients.set(hash, entity);
        entity.id = hash;
        return entity;
    }
    add(entity) {
        const hash = this.calculateOpenHash();
        this.entities.set(hash, entity);
        entity.id = hash;
        this.collisionGrid.insert(entity);
        return entity;
    }
    removeFromActive(entity) {
        entity.canCollide = false;
    }
    remove(entity) {
        entity.state = 4;
        entity.isDeleted = true;
        this.collisionGrid.remove(entity);
        this.entities.delete(entity.id);
    }
    removeClient(client) {
        this.clients.delete(client.id);
    }
    setZones(zones) {
        for (const zone of zones)
            this.zones.push(new SpawnZone(this, zone));
        return this;
    }
    setPortals(portals) {
        for (const portal of portals)
            this.add(new Portal_js_1.default(this, portal));
        return this;
    }
}
exports.default = Arena;
class SpawnZone {
    constructor(arena, definition) {
        this.MOB_CAP = 0;
        this.mobCount = 0;
        this.lastSpawned = -100;
        this.arena = arena;
        this.x = definition.x;
        this.y = definition.y;
        this.width = definition.w;
        this.height = definition.h;
        this.spawnTable = definition.spawnTable;
        this.MOB_CAP = definition.spawnTable.MOB_CAP || 8;
    }
    tick() {
        if (this.mobCount > this.MOB_CAP)
            return;
        if (Math.random() < this.spawnTable.BASE_CHANCE) {
            const potentialX = this.x + Math.random() * this.width;
            const potentialY = this.y + Math.random() * this.height;
            const id = (0, Helpers_js_1.FROM_OBJECT_TABLE)(this.spawnTable.MOB_CHANCE);
            const rarity = (0, Helpers_js_1.FROM_TABLE)(this.spawnTable.RARITY_CHANCE);
            const ent = new Mob_js_1.default(this.arena, this, potentialX, potentialY, 2 * Math.PI * Math.random(), rarity, MobDefinitions_js_1.default[id]);
            if (this.arena.collisionGrid.getEntityCollisions(ent).size)
                return;
            this.arena.add(ent);
            ++this.mobCount;
        }
    }
}
exports.SpawnZone = SpawnZone;
