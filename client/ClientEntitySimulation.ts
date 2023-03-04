class PositionComponent {
    values: {
        x: number;
        y: number;
        angle: number;
        radius: number;
    };
    last: {
        x: number;
        y: number;
        angle: number;
        radius: number;
    }
    lastUpdated: number;
    constructor(r: Reader) {
        this.values = {
            x: r.vi(),
            y: r.vi(),
            angle: r.f32(),
            radius: r.f32()
        }
        this.last = {...this.values};
        this.lastUpdated = performance.now();
    }
    get x() { return (performance.now() - this.lastUpdated) / MSPT }
}