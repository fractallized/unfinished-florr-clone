export class SpatialHash {
    static GRID_SIZE = 6; //128
    constructor(arena) {
        this.arena = arena;
        this.entities = arena.entities;
        //this.width = arena.arena.width;
        //this.height = arena.arena.height;
        this.map = new Map();
    }
    static getHash({x, y}) { return (x >> SpatialHash.GRID_SIZE) | ((y >> SpatialHash.GRID_SIZE) << SpatialHash.GRID_SIZE) }
    insert(entity) {
        const hash = SpatialHash.getHash(entity.pos);
        if (!this.map.has(hash)) this.map.set(hash, {[entity.id]: entity});
        else this.map.get(hash)[entity.id] = (entity);
        return hash;
    }
    remove(entity) {
        if (!this.map.has(entity.gridHash)) return;
        delete this.map.get(entity.gridHash)[entity.id];
    }
    getCollisions(x, y, w, h) {
        const ret = []
        const lenW = 1 + (w >> (SpatialHash.GRID_SIZE - 1)), lenH = 1 + (h >> (SpatialHash.GRID_SIZE - 1));
        const startX = x >> SpatialHash.GRID_SIZE, startY = y >> SpatialHash.GRID_SIZE;
        for (let Y = startY - lenH; Y <= startY + lenH; Y++) {
            for (let X = startX - lenW; X <= startX + lenW; X++) {
                if (X < 0 || Y < 0) continue;
                const hash = X | (Y << SpatialHash.GRID_SIZE);
                if (!this.map.has(hash)) continue;
                for (const ent of Object.values(this.map.get(hash))) ret.push(ent);
            }
        }
        return ret;
    }
    getEntityCollisions(entity, radius = entity.radius * 2) {
        const {x, y} = entity.pos;
        return this.getCollisions(x, y, radius, radius);
    }
    clear() {
        this.map = new Map();
    }
}