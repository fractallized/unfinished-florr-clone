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
    distanceSq({x, y}) {
        return (this.x-x)**2+(this.y-y)**2;
    }
}
export class Camera extends Vector {
    constructor(x,y) {
        super(x,y);
        this.fov = 1;
    }
}