"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Petal_1 = __importDefault(require("../object/player/Petal"));
const HealPetal_1 = __importDefault(require("../object/player/petal/HealPetal"));
const Missile_1 = __importDefault(require("../object/player/petal/Missile"));
const PETAL_DEFINITIONS = {
    1: {
        id: 1,
        radius: 10,
        damage: 10,
        health: 10,
        cooldown: 50,
        petal: Petal_1.default
    },
    2: {
        id: 2,
        radius: 7,
        damage: 8,
        health: 5,
        cooldown: 12,
        petal: Petal_1.default,
        repeat: [1, 2, 2, 3, 3, 5, 5, 7]
    },
    3: {
        id: 3,
        radius: 7,
        damage: 35,
        health: 5,
        cooldown: 100,
        petal: Petal_1.default,
        repeat: [1, 1, 1, 1, 1, 3, 5, 5],
        clump: true
    },
    4: {
        id: 4,
        radius: 10,
        damage: 5,
        health: 10,
        cooldown: 100,
        petal: HealPetal_1.default,
        preventExtend: true,
        heal: -10
    },
    5: {
        id: 5,
        radius: 15,
        damage: 8,
        health: 10,
        cooldown: 40,
        petal: HealPetal_1.default,
        heal: 0.3
    },
    6: {
        id: 6,
        radius: 15,
        damage: 15,
        health: 15,
        cooldown: 60,
        petal: Petal_1.default
    },
    7: {
        id: 7,
        radius: 0,
        damage: 0,
        health: 0,
        cooldown: 1,
        petal: Petal_1.default,
        noSpawn: true,
        fovMultiplier: [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55]
    },
    8: {
        id: 8,
        radius: 10,
        damage: 1,
        health: 2000,
        cooldown: 200,
        petal: Petal_1.default
    },
    9: {
        id: 9,
        radius: 7,
        damage: 5,
        health: 5,
        cooldown: 20,
        petal: Petal_1.default,
        rotationSpeedAddition: [0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4]
    },
    10: {
        id: 10,
        radius: 6,
        damage: 5,
        health: 5,
        cooldown: 150,
        petal: Petal_1.default
    },
    11: {
        id: 11,
        radius: 8,
        damage: 8,
        health: 10,
        cooldown: 25,
        petal: Missile_1.default,
        preventExtend: true
    }
};
exports.default = PETAL_DEFINITIONS;
