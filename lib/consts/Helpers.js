"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithin = exports.spliceOut = exports.FROM_OBJECT_TABLE = exports.FROM_TABLE = exports.PETAL_RARITY_MULTIPLIER = exports.MOB_SIZE_MULTIPLIER = exports.MOB_RARITY_MULTIPLIER = exports.LOOT_TABLE_GEN = exports.PI_2 = exports.RARITY_COUNT = void 0;
exports.RARITY_COUNT = 8;
exports.PI_2 = Math.PI * 2;
const MOB_RARITY_PROPAGATION = (x) => x * 0.4 + 0.01;
const MOB_VERTICAL_PROPAGATION = (x) => Math.max(x * 0.5 - 0.3, 0);
const LOOT_TABLE_GEN = (init) => {
    const ret = new Array(exports.RARITY_COUNT).fill(0).map(x => new Array(exports.RARITY_COUNT + 1).fill(0));
    let chanceLeft = 1;
    ret[0][0] = init;
    chanceLeft -= init;
    for (let dropR = 1; dropR < exports.RARITY_COUNT; dropR++) {
        init = MOB_RARITY_PROPAGATION(chanceLeft);
        if (chanceLeft <= init) {
            ret[0][dropR] = chanceLeft;
            chanceLeft = 0;
            break;
        }
        ret[0][dropR] = init;
        chanceLeft -= init;
    }
    let firstShift = 0;
    for (let mobR = 1; mobR < exports.RARITY_COUNT; ++mobR) {
        chanceLeft = 1;
        let base = MOB_VERTICAL_PROPAGATION(ret[mobR - 1][firstShift]);
        if (base === 0)
            ++firstShift;
        chanceLeft -= base;
        ret[mobR][firstShift] = base;
        for (let dropR = firstShift + 1; dropR <= mobR + 1; ++dropR) {
            base = MOB_RARITY_PROPAGATION(chanceLeft);
            if (chanceLeft <= base) {
                ret[mobR][dropR] = chanceLeft;
                chanceLeft = 0;
                break;
            }
            ret[mobR][dropR] = base;
            chanceLeft -= base;
        }
        ret[mobR][mobR + 1] += chanceLeft;
    }
    return ret;
};
exports.LOOT_TABLE_GEN = LOOT_TABLE_GEN;
exports.MOB_RARITY_MULTIPLIER = [1, 3, 10, 40, 150, 500, 2000, 6000];
exports.MOB_SIZE_MULTIPLIER = [1, 1.2, 1.5, 2, 3, 4, 6, 10];
exports.PETAL_RARITY_MULTIPLIER = [1, 3, 9, 27, 81, 243, 729, 2187];
const FROM_TABLE = (table) => {
    let rand = Math.random();
    for (let n = 0; n < table.length; ++n)
        if ((rand -= table[n]) <= 0)
            return n;
    return table.length - 1;
};
exports.FROM_TABLE = FROM_TABLE;
const FROM_OBJECT_TABLE = (table) => {
    let rand = Math.random();
    for (const [n, weight] of Object.entries(table))
        if ((rand -= weight) <= 0)
            return parseInt(n);
    return 0;
};
exports.FROM_OBJECT_TABLE = FROM_OBJECT_TABLE;
const spliceOut = (arr, val) => {
    const index = arr.indexOf(val);
    if (index !== -1)
        arr = arr.splice(index, 1);
};
exports.spliceOut = spliceOut;
const isWithin = (val, start, end) => {
    return val >= start && val <= end;
};
exports.isWithin = isWithin;
