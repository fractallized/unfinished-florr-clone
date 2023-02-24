import { LOOT_TABLE_GEN } from "../coder/Helpers.js";
import NeutralAI1 from "../object/mob/mob-behavior/NeutralAI.js";
import PassiveAI1 from "../object/mob/mob-behavior/PassiveAI.js";
const MOB_DEFINITIONS = {
    1: {
        size: 14,
        id: 1, //baby ant
        health: 20,
        damage: 10,
        loot: {
            2: LOOT_TABLE_GEN(0.75),
            5: LOOT_TABLE_GEN(0.75)
        },
        AI: r => PassiveAI1
    },
    2: {
        size: 14,
        id: 2, //worker ant
        health: 25,
        damage: 15,
        loot: {
            2: LOOT_TABLE_GEN(0.5),
            5: LOOT_TABLE_GEN(0.5),
        },
        AI: r => NeutralAI1
    },
    3: {
        size: 14,
        id: 3, //soldier ant
        health: 30,
        damage: 20,
        loot: {
            2: LOOT_TABLE_GEN(0.4),
            5: LOOT_TABLE_GEN(0.4),
            6: LOOT_TABLE_GEN(1)
        },
        AI: r => NeutralAI1
    },
    4: {
        size: 30,
        id: 4, //ladybug
        health: 30,
        damage: 10,
        loot: {
            2: LOOT_TABLE_GEN(0.6),
            4: LOOT_TABLE_GEN(0.5),
            8: LOOT_TABLE_GEN(0.8)
        },
        AI: r => r < 2? PassiveAI1: NeutralAI1
    },
    5: {
        size: 25,
        id: 5, //bee
        health: 15,
        damage: 40,
        loot: {
            1: LOOT_TABLE_GEN(1),
            2: LOOT_TABLE_GEN(1),
            4: LOOT_TABLE_GEN(1),
            5: LOOT_TABLE_GEN(1),
            6: LOOT_TABLE_GEN(1),
            8: LOOT_TABLE_GEN(1),
            3: LOOT_TABLE_GEN(0.6),
            7: LOOT_TABLE_GEN(0.2),
            9: LOOT_TABLE_GEN(0.1)
        },
        AI: r => NeutralAI1
    },
}
export default MOB_DEFINITIONS;