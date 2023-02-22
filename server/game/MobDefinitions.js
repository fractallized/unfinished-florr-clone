import { LOOT_TABLE_GEN } from "../coder/Helpers.js";
export const MOB_DEFINITIONS = {
    1: {
        size: 14,
        id: 1, //baby ant
        health: 20,
        damage: 10,
        loot: {
            2: LOOT_TABLE_GEN(0.75),
            5: LOOT_TABLE_GEN(0.75)
        }
    },
    2: {
        size: 14,
        id: 2, //worker ant
        health: 25,
        damage: 15,
        loot: {
            2: LOOT_TABLE_GEN(0.5),
            5: LOOT_TABLE_GEN(0.5),
        }
    },
    3: {
        size: 14,
        id: 3, //soldier ant
        health: 30,
        damage: 20,
        loot: {
            2: LOOT_TABLE_GEN(0.4),
            5: LOOT_TABLE_GEN(0.4)
        }
    },
    4: {
        size: 30,
        id: 4, //ladybug
        health: 30,
        damage: 10,
        loot: {
            4: LOOT_TABLE_GEN(0.5)
        }
    },
    5: {
        size: 25,
        id: 5, //bee
        health: 15,
        damage: 40,
        loot: {
            2: LOOT_TABLE_GEN(0.6),
            3: LOOT_TABLE_GEN(0.6)
        }
    }
}