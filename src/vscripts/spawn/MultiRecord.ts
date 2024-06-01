export class MultiRecord {

    private name: string;
    private count: number;

    constructor(name: string, count: number) {
        this.name = name;
        this.count = count;
    }

    public getName() {
        return this.name;
    }

    public getCount() {
        return this.count;
    }
}
