
export class DotaRandom {

    // chance: from 0 to 100
    public Proc(chance: number): boolean {
        return this.ProcPercent(chance / 100);
    }

    // chance: from 0 to 1
    public ProcPercent(chance: number): boolean {
        const proc: number = Math.random();
        return proc <= chance;
    }
}
