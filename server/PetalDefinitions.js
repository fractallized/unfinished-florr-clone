import { HealPetal } from "./object/player/HealPetal.js";
import { Petal } from "./object/player/Petal.js";

export const PETAL_DEFINITIONS = {
    0: null,
    1: {
        id: 1,
        radius: 10,
        damage: 20,
        health: 20,
        cooldown: 100,
        petal: Petal
    },
    2: {
        id: 2,
        radius: 5,
        damage: 5,
        health: 10,
        cooldown: 20,
        petal: Petal
    },
    3: {
        id: 3,
        radius: 5,
        damage: 100,
        health: 2000,
        cooldown: 50,
        petal: Petal
    },
    4: {
        id: 4,
        radius: 10,
        damage: 5,
        health: 5,
        cooldown: 125,
        petal: HealPetal,
        preventExtend: true,
        heal: -10 //negative if the petal sacrifices itself
    }
}
export const PETAL_RARITY_MULTIPLIER = [1, 2, 4, 8, 16, 32, 64];