export const RARITY_COUNT = 8;
export const PI_2 = Math.PI * 2;
export const LOOT_TABLE_GEN = (n: number) => {
    const mobS = [60000,15000,2500,100,5,0.1,0.003,0.0001];
    const dropS = [0,0.6932697314296992,0.9705776240015788,0.9983084132587667,0.9999722606141981,0.9999999914034552,
0.999999999722692,1]
    const ret: number[][] = new Array(RARITY_COUNT).fill(0).map(_ => new Array(RARITY_COUNT - 1).fill(0));
    for (let mob = 0; mob < RARITY_COUNT; ++mob) {
        let cap = mob ? mob: 1;
        for (let drop = 0; drop <= cap; ++drop) {
            if (drop > 6) break;
            let start = dropS[drop], end = dropS[drop+1];
            if (drop === cap) end = 1;
            const ret1 = Math.pow(n*start+(1-n),300000/mobS[mob]);
            const ret2 = Math.pow(n*end+(1-n),300000/mobS[mob]);
            ret[mob][drop] = parseFloat((ret2-ret1).toFixed(2));
        }
    }
    return ret;
}
export const MOB_RARITY_MULTIPLIER = [1, 3, 10, 40, 150, 500, 2000, 6000];
export const MOB_SIZE_MULTIPLIER = [1, 1.2, 1.5, 2, 3, 4, 6, 10];
export const PETAL_RARITY_MULTIPLIER = [1, 3, 9, 27, 81, 243, 729, 2187];
export const FROM_TABLE = (table: number[]) => {
    let rand = Math.random();
    for (let n = 0; n < table.length; ++n) if ((rand -= table[n]) <= 0) return n;
    return -1;
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