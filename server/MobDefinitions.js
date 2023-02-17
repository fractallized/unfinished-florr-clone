import { LOOT_TABLE_GEN } from "./coder/Helpers.js";
export const MOB_DEFINITIONS = {
    1: {
        size: 10,
        id: 1,
        health: 50,
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
        damage: 30,
        loot: {
            2: LOOT_TABLE_GEN(0.5),
            5: LOOT_TABLE_GEN(0.5),
        }
    },
    3: {
        size: 10,
        id: 3,
        health: 10,
        damage: 50,
        loot: {
            2: LOOT_TABLE_GEN(0.5),
            5: LOOT_TABLE_GEN(0.75)
        }
    },
    4: {
        size: 15,
        id: 4,
        health: 30,
        damage: 10,
        loot: {
            4: LOOT_TABLE_GEN(0.8)
        }
    },
    5: {
        size: 15,
        id: 5,
        health: 20,
        damage: 30,
        loot: {
            1: LOOT_TABLE_GEN(0.75),
            3: LOOT_TABLE_GEN(0)
        }
    }
}