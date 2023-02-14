export const PETAL_DEFINITIONS = {
    0: null,
    1: {
        id: 1,
        radius: 10,
        damage: 10,
        health: 10,
        cooldown: 50,
        petal: 'Petal'
    },
    2: {
        id: 2,
        radius: 5,
        damage: 8,
        health: 5,
        cooldown: 25,
        petal: 'Petal'
    },
    3: {
        id: 3,
        radius: 8,
        damage: 35,
        health: 5,
        cooldown: 82,
        petal: 'Petal'
    },
    4: {
        id: 4,
        radius: 10,
        damage: 5,
        health: 10,
        cooldown: 100,
        petal: 'HealPetal',
        preventExtend: true,
        heal: -2 //negative if the petal sacrifices itself
    }
}
export const PETAL_RARITY_MULTIPLIER = [1, 2, 4, 8, 16, 32, 64];