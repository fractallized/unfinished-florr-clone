import Entity from "../object/Entity";
import { VectorLike } from "../object/Vector";

export default class SpatialHash {
    static GRID_SIZE = 6; //64
    map: Record<number, Set<Entity>>;
    constructor() {
        this.map = {};
    }
    static getHash(v: VectorLike) { return (v.x >> SpatialHash.GRID_SIZE) | ((v.y >> SpatialHash.GRID_SIZE) << 16) }
    insert(entity: Entity) {
        const startX = Math.max((entity.pos.x - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0),
        endX = (entity.pos.x + entity.pos.radius) >> SpatialHash.GRID_SIZE,
        startY = Math.max((entity.pos.y - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0),
        endY = (entity.pos.y + entity.pos.radius) >> SpatialHash.GRID_SIZE;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash]) this.map[hash] = new Set();
                this.map[hash].add(entity);
            }
        }
        entity.gridBounds = [startX, startY, endX, endY]; //have to rethink this
    }
    remove(entity: Entity) {
        const [startX, startY, endX, endY] = entity.gridBounds;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash]) continue;
                this.map[hash].delete(entity);
            }
        }
    }
    getCollisions(x: number, y: number, w: number, h: number) {
        const ret: Set<Entity> = new Set();
        const startX = Math.max((x - w) >> SpatialHash.GRID_SIZE, 0),
        endX = (x + w) >> SpatialHash.GRID_SIZE,
        startY = Math.max((y - h) >> SpatialHash.GRID_SIZE, 0),
        endY = (y + h) >> SpatialHash.GRID_SIZE;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash]) continue;
                for (const ent of this.map[hash]) ret.add(ent);
            }
        }
        return ret;
    }
    getEntityCollisions(entity: Entity, radius: number = entity.pos.radius) {
        const {x, y} = entity.pos;
        return this.getCollisions(x, y, radius, radius);
    }
    clear() {
        this.map = {};
    }
}