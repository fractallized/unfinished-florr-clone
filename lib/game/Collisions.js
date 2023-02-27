"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("../consts/Helpers");
class SpatialHash {
    constructor() {
        this.queryID = 0;
        this.map = {};
    }
    static getHash(v) { return (v.x >> SpatialHash.GRID_SIZE) | ((v.y >> SpatialHash.GRID_SIZE) << 16); }
    insert(entity) {
        const startX = Math.max((entity.pos.x - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0), endX = (entity.pos.x + entity.pos.radius) >> SpatialHash.GRID_SIZE, startY = Math.max((entity.pos.y - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0), endY = (entity.pos.y + entity.pos.radius) >> SpatialHash.GRID_SIZE;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash])
                    this.map[hash] = [entity];
                else
                    this.map[hash].push(entity);
            }
        }
        entity.gridBounds = [startX, startY, endX, endY];
    }
    remove(entity) {
        const [startX, startY, endX, endY] = entity.gridBounds;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash])
                    continue;
                (0, Helpers_1.spliceOut)(this.map[hash], entity);
            }
        }
    }
    reinsert(entity) {
        const [startX, startY, endX, endY] = entity.gridBounds;
        const newStartX = Math.max((entity.pos.x - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0), newEndX = (entity.pos.x + entity.pos.radius) >> SpatialHash.GRID_SIZE, newStartY = Math.max((entity.pos.y - entity.pos.radius) >> SpatialHash.GRID_SIZE, 0), newEndY = (entity.pos.y + entity.pos.radius) >> SpatialHash.GRID_SIZE;
        const sX = Math.min(startX, newStartX), sY = Math.min(startY, newStartY), eX = Math.max(endX, newEndX), eY = Math.max(endY, newEndY);
        for (let Y = sY; Y <= eY; ++Y) {
            for (let X = sX; X <= eX; ++X) {
                const hash = X | (Y << 16);
                if ((0, Helpers_1.isWithin)(X, startX, endX) && (0, Helpers_1.isWithin)(Y, startY, endY) && !((0, Helpers_1.isWithin)(X, newStartX, newEndX) && (0, Helpers_1.isWithin)(Y, newStartY, newEndY))) {
                    (0, Helpers_1.spliceOut)(this.map[hash], entity);
                }
                else if (!((0, Helpers_1.isWithin)(X, startX, endX) && (0, Helpers_1.isWithin)(Y, startY, endY)) && (0, Helpers_1.isWithin)(X, newStartX, newEndX) && (0, Helpers_1.isWithin)(Y, newStartY, newEndY)) {
                    if (!this.map[hash])
                        this.map[hash] = [entity];
                    else
                        this.map[hash].push(entity);
                }
            }
        }
        entity.gridBounds = [newStartX, newStartY, newEndX, newEndY];
    }
    getCollisions(x, y, w, h) {
        const ret = [];
        const startX = Math.max((x - w) >> SpatialHash.GRID_SIZE, 0), endX = (x + w) >> SpatialHash.GRID_SIZE, startY = Math.max((y - h) >> SpatialHash.GRID_SIZE, 0), endY = (y + h) >> SpatialHash.GRID_SIZE;
        for (let Y = startY; Y <= endY; ++Y) {
            for (let X = startX; X <= endX; ++X) {
                const hash = X | (Y << 16);
                if (!this.map[hash])
                    continue;
                for (const ent of this.map[hash]) {
                    if (ent.lastQueried === this.queryID)
                        continue;
                    ent.lastQueried = this.queryID;
                    ret.push(ent);
                }
            }
        }
        this.queryID = (this.queryID + 1) & 65535;
        return ret;
    }
    getEntityCollisions(entity, radius = entity.pos.radius) {
        const { x, y } = entity.pos;
        return this.getCollisions(x, y, radius, radius);
    }
    clear() {
        this.map = {};
    }
}
exports.default = SpatialHash;
SpatialHash.GRID_SIZE = 7;
