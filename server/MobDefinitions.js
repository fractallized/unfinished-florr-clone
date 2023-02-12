export const MOB_DEFINITIONS = {
    0: {
        id: 0,
        health: 200,
        damage: 10,
        loot: {
            1: [0.1, 0.3, 0.2, 0.4], //chance of getting each
            2: [0.2, 0.2, 0.2, 0.1, 0.3],
            3: [0, 0, 0, 1]
        }
    },
    1: {
        id: 1,
        health: 50,
        damage: 2,
        loot: {
            1: [0, 1],
            2: [0, 1],
            3: [0.2, 0.8]
        }
    }
}
export const PETAL_RARITY_MULTIPLIER = [1, 2, 4, 8, 16, 32, 64];