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
        petal: 'Petal',
        repeat: [1,2,2,3,3,5,5,7]
    },
    3: {
        id: 3,
        radius: 8,
        damage: 35,
        health: 5,
        cooldown: 82,
        petal: 'Petal',
        repeat: [1,1,1,1,3,5,5,5],
        clump: true
    },
    4: {
        id: 4,
        radius: 10,
        damage: 5,
        health: 10,
        cooldown: 100,
        petal: 'HealPetal',
        preventExtend: true,
        heal: -10 //negative if the petal sacrifices itself
    },
    5: {
        id: 5,
        radius: 10,
        damage: 8,
        health: 10,
        cooldown: 20,
        petal: 'HealPetal',
        heal: 0.3
    }
}