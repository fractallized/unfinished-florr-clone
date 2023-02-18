import { LOOT_TABLE_GEN } from "./coder/Helpers.js";
export const MOB_DEFINITIONS = {
    1: {
        size: 10,
        id: 1,
        health: 20,
        damage: 10,
        loot: {
            2: LOOT_TABLE_GEN(0.75),
            5: LOOT_TABLE_GEN(0.75)
        }
    },
    2: {
        size: 10,
        id: 2,
        health: 25,
        damage: 15,
        loot: {
            2: LOOT_TABLE_GEN(0.5),
            5: LOOT_TABLE_GEN(0.5),
        }
    },
    3: {
        size: 10,
        id: 3,
        health: 30,
        damage: 20,
        loot: {
            2: LOOT_TABLE_GEN(0.4),
            5: LOOT_TABLE_GEN(0.4)
        }
    },
    4: {
        size: 15,
        id: 4,
        health: 30,
        damage: 10,
        loot: {
            4: LOOT_TABLE_GEN(0.5)
        }
    },
    5: {
        size: 15,
        id: 5,
        health: 15,
        damage: 40,
        loot: {
            1: LOOT_TABLE_GEN(0.6),
            3: LOOT_TABLE_GEN(0.6)
        }
    }
}