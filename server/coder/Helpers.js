export const RARITY_COUNT = 8;
const MOB_RARITY_PROPAGATION = x => x * 0.8 + 0.01;
const MOB_VERTICAL_PROPAGATION = x => Math.max(x * 0.8 - 0.4, 0);
export const LOOT_TABLE_GEN = init => {
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
        for (let dropR = firstShift + 1; dropR < RARITY_COUNT; ++dropR) {
          base = MOB_RARITY_PROPAGATION(chanceLeft);
            if (chanceLeft <= base) { ret[mobR][dropR] = chanceLeft; chanceLeft = 0; break; }
            ret[mobR][dropR] = base;
            chanceLeft -= base;
        }
        ret[mobR][RARITY_COUNT] = chanceLeft;
    }
    return ret;
}
export const MOB_RARITY_MULTIPLIER = [1, 3, 10, 40, 150, 500, 2000, 6000];
export const MOB_SIZE_MULTIPLIER = [1, 1.2, 1.5, 2, 3, 4, 6, 10];
export const PETAL_RARITY_MULTIPLIER = [1, 3, 9, 27, 81, 243, 729, 2187];
export const FROM_TABLE = table => {
    let rand = Math.random();
    for (let n = 0; n < table.length; ++n) if ((rand -= table[n]) <= 0) return n;
    return table.length - 1;
}
export const FROM_OBJECT_TABLE = table => {
    let rand = Math.random();
    for (const [n, weight] of Object.entries(table)) if ((rand -= weight) <= 0) return n;
    return 0;
}