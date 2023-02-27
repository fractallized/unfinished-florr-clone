export const RARITY_COUNT = 8;
export const PI_2 = Math.PI * 2;
const MOB_RARITY_PROPAGATION = (x: number) => x * 0.4 + 0.01;
const MOB_VERTICAL_PROPAGATION = (x: number) => Math.max(x * 0.5 - 0.3, 0);
export const LOOT_TABLE_GEN = (init: number) => {
    const ret = new Array(RARITY_COUNT).fill(0).map(x =>new Array(RARITY_COUNT + 1).fill(0));
    let chanceLeft = 1;
    ret[0][0] = init;
    chanceLeft -= init;
    for (let dropR = 1; dropR < RARITY_COUNT; dropR++) {
        init = MOB_RARITY_PROPAGATION(chanceLeft);
        if (chanceLeft <= init) { ret[0][dropR] = chanceLeft; chanceLeft = 0; break; }
        ret[0][dropR] = init;
        chanceLeft -= init;
    }
    let firstShift = 0;
    for (let mobR = 1; mobR < RARITY_COUNT; ++mobR) {
        chanceLeft = 1;
        let base = MOB_VERTICAL_PROPAGATION(ret[mobR - 1][firstShift]);
        if (base === 0)  ++firstShift;
        chanceLeft -= base;
        ret[mobR][firstShift] = base;
        for (let dropR = firstShift + 1; dropR <= mobR+1; ++dropR) {
          base = MOB_RARITY_PROPAGATION(chanceLeft);
            if (chanceLeft <= base) { ret[mobR][dropR] = chanceLeft; chanceLeft = 0; break; }
            ret[mobR][dropR] = base;
            chanceLeft -= base;
        }
        ret[mobR][mobR+1] += chanceLeft;
    }
    return ret;
}
export const MOB_RARITY_MULTIPLIER = [1, 3, 10, 40, 150, 500, 2000, 6000];
export const MOB_SIZE_MULTIPLIER = [1, 1.2, 1.5, 2, 3, 4, 6, 10];
export const PETAL_RARITY_MULTIPLIER = [1, 3, 9, 27, 81, 243, 729, 2187];
export const FROM_TABLE = (table: number[]) => {
    let rand = Math.random();
    for (let n = 0; n < table.length; ++n) if ((rand -= table[n]) <= 0) return n;
    return table.length - 1;
}
export const FROM_OBJECT_TABLE = (table: Record<number, number>) => {
    let rand = Math.random();
    for (const [n, weight] of Object.entries(table)) if ((rand -= weight) <= 0) return parseInt(n);
    return 0;
}
export const spliceOut = (arr: any[], val: any) => {
    const index = arr.indexOf(val);
    if (index !== -1) arr = arr.splice(index, 1);
}
export const isWithin = (val: number, start: number, end: number) => {
    return val >= start && val <= end;
}
export const minAngleDifference = (angle1: number, angle2: number) => {
    const first = Math.abs(angle1 - angle2) % PI_2;
    const second = PI_2 - (Math.abs(angle1 - angle2) % PI_2);
    return Math.min(first, second);
}