"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_js_1 = require("../coder/Helpers.js");
const NeutralAI_1 = __importDefault(require("../object/mob/mob-behavior/NeutralAI"));
const PassiveAI_1 = __importDefault(require("../object/mob/mob-behavior/PassiveAI"));
const MOB_DEFINITIONS = {
    1: {
        size: 14,
        id: 1,
        health: 20,
        damage: 10,
        loot: {
            2: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.75),
            5: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.75)
        },
        AI: (r) => PassiveAI_1.default
    },
    2: {
        size: 14,
        id: 2,
        health: 25,
        damage: 15,
        loot: {
            2: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.5),
            5: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.5),
        },
        AI: (r) => NeutralAI_1.default
    },
    3: {
        size: 14,
        id: 3,
        health: 30,
        damage: 20,
        loot: {
            2: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.4),
            5: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.4),
            6: (0, Helpers_js_1.LOOT_TABLE_GEN)(1)
        },
        AI: (r) => NeutralAI_1.default
    },
    4: {
        size: 30,
        id: 4,
        health: 30,
        damage: 10,
        loot: {
            2: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.6),
            4: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.5),
            8: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.8)
        },
        AI: (r) => r < 2 ? PassiveAI_1.default : NeutralAI_1.default
    },
    5: {
        size: 25,
        id: 5,
        health: 15,
        damage: 40,
        loot: {
            1: (0, Helpers_js_1.LOOT_TABLE_GEN)(1),
            2: (0, Helpers_js_1.LOOT_TABLE_GEN)(1),
            4: (0, Helpers_js_1.LOOT_TABLE_GEN)(1),
            5: (0, Helpers_js_1.LOOT_TABLE_GEN)(1),
            6: (0, Helpers_js_1.LOOT_TABLE_GEN)(1),
            8: (0, Helpers_js_1.LOOT_TABLE_GEN)(1),
            3: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.6),
            7: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.2),
            9: (0, Helpers_js_1.LOOT_TABLE_GEN)(0.1)
        },
        AI: (r) => NeutralAI_1.default
    },
};
exports.default = MOB_DEFINITIONS;
