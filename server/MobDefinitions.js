export const RARITY_COUNT = 6;
const RARITY_PROPAGATION = x => x * 0.8 + 0.01;
const VERTICAL_PROPAGATION = x => Math.max(x * 0.8 - 0.4, 0);
const LOOT_TABLE_GEN = init => {
    const ret = new Array(RARITY_COUNT).fill(0).map(x =>new Array(RARITY_COUNT + 1).fill(0));
    let chanceLeft = 1;
    ret[0][0] = init;
    chanceLeft -= init;
    for (let dropR = 1; dropR < RARITY_COUNT; dropR++) {
        init = RARITY_PROPAGATION(chanceLeft);
        if (chanceLeft <= init) { ret[0][dropR] = chanceLeft; chanceLeft = 0; break; }
        ret[0][dropR] = init;
        chanceLeft -= init;
    }
    let firstShift = 0;
    for (let mobR = 1; mobR < RARITY_COUNT; ++mobR) {
        chanceLeft = 1;
        let base = VERTICAL_PROPAGATION(ret[mobR - 1][firstShift]);
        while (base === 0) {
            ++firstShift;
            base = VERTICAL_PROPAGATION(ret[mobR - 1][firstShift]); 
        }
        chanceLeft -= base;
        ret[mobR][firstShift] = base;
        for (let dropR = firstShift + 1; dropR < RARITY_COUNT; ++dropR) {
          base = RARITY_PROPAGATION(chanceLeft);
            if (chanceLeft <= base) { ret[mobR][dropR] = chanceLeft; chanceLeft = 0; break; }
            ret[mobR][dropR] = base;
            chanceLeft -= base;
        }
        ret[mobR][RARITY_COUNT] = chanceLeft;
    }
    return ret;
}
export const MOB_DEFINITIONS = {
    0: {
        size: 30,
        id: 0,
        health: 200,
        damage: 10,
        loot: {
            2: LOOT_TABLE_GEN(0.5),
            3: LOOT_TABLE_GEN(0.8),
            4: LOOT_TABLE_GEN(0.4)
        }
    },
    1: {
        size: 20,
        id: 1,
        health: 100,
        damage: 30,
        loot: {
            2: LOOT_TABLE_GEN(0.1),
            3: LOOT_TABLE_GEN(0.8),
        }
    }
}
export const MOB_RARITY_MULTIPLIER = [1, 2, 4, 8, 16, 32, 64];
export const MOB_SIZE_MULTIPLIER = [1, 1.3, 1.5, 2, 3, 4];