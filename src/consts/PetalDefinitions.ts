import Petal from "../object/player/Petal";
import HealPetal from "../object/player/petal/HealPetal";
import Missile from "../object/player/petal/Missile";

export interface PetalDefinition {
    id: number,
    radius: number,
    damage: number,
    health: number,
    cooldown: number,
    petal: typeof Petal,
    
    clump?: boolean,
    heal?: number,
    noSpawn?: boolean,
    preventExtend?: boolean,
    repeat?: number[];
    fovMultiplier?: number[],
    rotationSpeedAddition?: number[],
    poison?: {
        dpt: number,
        ticks: number
    }
}
const PETAL_DEFINITIONS: Record<number, PetalDefinition> = {
    1: {
        id: 1, //basic
        radius: 10,
        damage: 10,
        health: 10,
        cooldown: 50,
        petal: Petal
    },
    2: {
        id: 2, //light
        radius: 7,
        damage: 8,
        health: 5,
        cooldown: 12,
        petal: Petal,
        repeat: [1,2,2,3,3,5,5,7]
    },
    3: {
        id: 3, //stinger
        radius: 7,
        damage: 35,
        health: 5,
        cooldown: 100,
        petal: Petal,
        repeat: [1,1,1,1,1,3,5,5],
        clump: true
    },
    4: {
        id: 4, //rose
        radius: 10,
        damage: 5,
        health: 10,
        cooldown: 100,
        petal: HealPetal,
        preventExtend: true,
        heal: -10 //negative if the petal sacrifices itself
    },
    5: {
        id: 5, //leaf
        radius: 15,
        damage: 8,
        health: 10,
        cooldown: 40,
        petal: HealPetal,
        heal: 0.3
    },
    6: {
        id: 6, //wing
        radius: 15,
        damage: 15,
        health: 15,
        cooldown: 60,
        petal: Petal
    },
    7: {
        id: 7, //antennae (first special petal)
        radius: 0,
        damage: 0,
        health: 0, 
        cooldown: 1,
        petal: Petal,
        noSpawn: true,
        fovMultiplier: [0.9,0.85,0.8,0.75,0.7,0.65,0.6,0.55]
    },
    8: {
        id: 8, //rock
        radius: 10,
        damage: 1,
        health: 2000,
        cooldown: 200,
        petal: Petal
    }, 
    9: {
        id: 9, //faster
        radius: 7,
        damage: 5,
        health: 5,
        cooldown: 20,
        petal: Petal,
        rotationSpeedAddition: [0.3,0.6,0.9,1.2,1.5,1.8,2.1,2.4]
    },
    10: {
        id: 10, //iris
        radius: 6,
        damage: 1,
        health: 5,
        cooldown: 150,
        petal: Petal,
        poison: {
            dpt: 0.2,
            ticks: 50
        }
    },
    11: {
        id: 11, //missile (special petal)
        radius: 8,
        damage: 10,
        health: 10,
        cooldown: 40,
        petal: Missile,
        preventExtend: true,
    }
}
export default PETAL_DEFINITIONS;