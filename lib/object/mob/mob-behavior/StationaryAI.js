"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AI_1 = __importDefault(require("./AI"));
class StationaryAI extends AI_1.default {
    constructor(mob) {
        super(mob);
    }
}
exports.default = StationaryAI;
