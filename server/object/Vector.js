export class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    set(x,y) {
        this.x = x;
        this.y = y;
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
    }
    add({x, y}) {
        this.x += x;
        this.y += y;
    }
    sub({x, y}) {
        this.x -= x;
        this.y -= y;
    }
}