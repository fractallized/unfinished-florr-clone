import { Object } from "../object/Object.js";
export class Arena {
    constructor(server, x, y) {
        this.server = server;
        this.width = x;
        this.height = y;
        this.entities = new Set();
        this.zones = [new SpawnZone(this,0,0,100,100,{})];
        this.players = new Set();
    }
    tick() {
        for (const entity of this.entities) entity.tick();
        for (const zone of this.zones) zone.tick();
    }
    add(entity) {
        this.entities.add(entity);
    }
    remove(entity) {
        this.entities.delete(entity);
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
        if (Math.random() < 0.02) {
            const potentialX = this.x + Math.random() * this.width;
            const potentialY = this.y + Math.random() * this.height;
            this.arena.add(new Object(this.arena, potentialX, potentialY, 10, 0));
        }
    }
}