import { isWithin, spliceOut } from "../consts/Helpers";
import Entity from "../object/Entity";
import { VectorLike } from "../object/Vector";

export default class SpatialHash {
    static GRID_SIZE = 7; //64
    map: Record<number, Entity[]>;
    queryID = 0;
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
                if (!this.map[hash]) this.map[hash] = [entity];
                else this.map[hash].push(entity);
            }
        }
        entity.gridBounds = [startX, startY, endX, endY];
    }
    remove(entity: Entity) {
        const [startX, startY, endX, endY] = entity.gridBounds;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash]) continue;
                spliceOut(this.map[hash], entity);
            }
        }
    }
    reinsert(entity: Entity) {
        const [startX, startY, endX, endY] = entity.gridBounds;
        const newStartX = Math.max((entity.pos.x - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0),
        newEndX = (entity.pos.x + entity.pos.radius) >> SpatialHash.GRID_SIZE,
        newStartY = Math.max((entity.pos.y - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0),
        newEndY = (entity.pos.y + entity.pos.radius) >> SpatialHash.GRID_SIZE;
        const sX = Math.min(startX, newStartX),
        sY = Math.min(startY, newStartY),
        eX = Math.max(endX, newEndX),
        eY = Math.max(endY, newEndY);
        for (let Y = sY; Y <= eY; ++Y) {
            for (let X = sX; X <= eX; ++X) {
                const hash = X | (Y << 16);
                if (isWithin(X, startX, endX) && isWithin(Y, startY, endY) && !(isWithin(X, newStartX, newEndX) && isWithin(Y, newStartY, newEndY))) {
                    spliceOut(this.map[hash], entity);
                }
                else if (!(isWithin(X, startX, endX) && isWithin(Y, startY, endY)) && isWithin(X, newStartX, newEndX) && isWithin(Y, newStartY, newEndY)) {
                    if (!this.map[hash]) this.map[hash] = [entity];
                    else this.map[hash].push(entity);
                }
            }
        }
        entity.gridBounds = [newStartX, newStartY, newEndX, newEndY];
    }
    getCollisions(x: number, y: number, w: number, h: number) {
        const ret: Entity[] = [];
        const startX = Math.max((x - w) >> SpatialHash.GRID_SIZE, 0),
        endX = (x + w) >> SpatialHash.GRID_SIZE,
        startY = Math.max((y - h) >> SpatialHash.GRID_SIZE, 0),
        endY = (y + h) >> SpatialHash.GRID_SIZE;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash]) continue;
                for (const ent of this.map[hash]) {
                    if (ent.lastQueried === this.queryID) continue;
                    ent.lastQueried = this.queryID;
                    ret.push(ent);
                }
            }
        }
        this.queryID = (this.queryID + 1) & 65535;
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