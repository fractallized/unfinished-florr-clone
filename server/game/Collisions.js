export class SpatialHash {
    static GRID_SIZE = 6; //64
    constructor(arena) {
        this.arena = arena;
        this.entities = arena.entities;
        //this.width = arena.arena.width;
        //this.height = arena.arena.height;
        this.map = new Map();
    }
    static getHash({x, y}) { return (x >> SpatialHash.GRID_SIZE) | ((y >> SpatialHash.GRID_SIZE) << 16) }
    insert(entity) {
        const startX = Math.max((entity.pos.x - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0),
        endX = (entity.pos.x + entity.pos.radius) >> SpatialHash.GRID_SIZE,
        startY = Math.max((entity.pos.y - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0),
        endY = (entity.pos.y + entity.pos.radius) >> SpatialHash.GRID_SIZE;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map.has(hash)) this.map.set(hash, new Set());
                this.map.get(hash).add(entity);
            }
        }
        entity.gridBounds = [startX, startY, endX, endY]; //have to rethink this
    }
    remove(entity) {
        const [startX, startY, endX, endY] = entity.gridBounds;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map.has(hash)) continue;
                this.map.get(hash).delete(entity);
            }
        }
    }
    getCollisions(x, y, w, h) {
        const ret = new Set();
        const startX = Math.max((x - w) >> SpatialHash.GRID_SIZE, 0),
        endX = (x + w) >> SpatialHash.GRID_SIZE,
        startY = Math.max((y - h) >> SpatialHash.GRID_SIZE, 0),
        endY = (y + h) >> SpatialHash.GRID_SIZE;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map.has(hash)) continue;
                for (const ent of this.map.get(hash)) ret.add(ent);
            }
        }
        return ret;
    }
    getEntityCollisions(entity) {
        const {x, y, radius} = entity.pos;
        return this.getCollisions(x, y, radius, radius);
    }
    clear() {
        this.map = new Map();
    }
}