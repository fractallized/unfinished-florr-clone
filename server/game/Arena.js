import { Mob } from "../object/mob/Mob.js";
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
        this.zones = [new SpawnZone(this,0,0,1000,1000,{})];
        this.deletions = [];
    }
    tick() {
        this.deletions = [];
        for (const entity of Object.values(this.entities)) entity.tick();
        for (const id of this.deletions) delete this.entities[id];
        for (const zone of this.zones) zone.tick();
    }
    calculateOpenHash() {
        for (let n = 1; n < 16384; n++) if (!this.entities.hasOwnProperty(n)) return n;
        return 16384;
    }
    calculateClientHash() {
        for (let n = 16384; n < 32768; n++) if (!this.entities.hasOwnProperty(n)) return n;
        return 16384;
    }
    addClient(entity) {
        const hash = this.calculateClientHash();
        this.entities[hash] = (entity);
        entity.id = hash;
    }
    add(entity) {
        const hash = this.calculateOpenHash();
        this.entities[hash] = (entity);
        entity.id = hash;
    }
    remove(entity) {
        this.deletions.push(entity.id);
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
        if (Math.random() < 0.005 && Object.keys(this.arena.entities).length < 15) {
            const potentialX = this.x + Math.random() * this.width;
            const potentialY = this.y + Math.random() * this.height;
            const ent = new Mob(this.arena, potentialX, potentialY, 20, 0);
            this.arena.add(ent);
        }
    }
}