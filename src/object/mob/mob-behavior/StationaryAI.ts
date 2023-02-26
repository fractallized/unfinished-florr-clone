import Mob from "../Mob";
import AI from "./AI";

export default class StationaryAI extends AI {
    constructor(mob: Mob) {
        super(mob);
    }
}