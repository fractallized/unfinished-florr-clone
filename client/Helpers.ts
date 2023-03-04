const lerp = (start: number, end: number, t: number) => {
    t = Math.max(Math.min(t, 1), 0);
    return start + (end - start) * t;
}