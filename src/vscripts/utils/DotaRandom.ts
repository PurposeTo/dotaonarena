
export class DotaRandom {

    // chance: from 0 to 100
    public static Proc(chance: number): boolean {
        return this.ProcPercent(chance / 100);
    }

    // chance: from 0 to 1
    public static ProcPercent(chance: number): boolean {
        const proc: number = Math.random();
        return proc <= chance;
    }

    public static randomArrayValue<T>(array: Array<T>): T {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    public static randomMapValue<T>(map: Map<any, T>) {
        const values = map.values();
        const array = Array.from(values);
        return this.randomArrayValue(array);
    }
}
