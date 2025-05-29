
export class UnitsDto {

    private name: string;
    private count: number;

    constructor(name: string, count: number) {
        this.name = name;
        this.count = count;
    }

    public GetName() {
        return this.name;
    }

    public GetCount() {
        return this.count;
    }
}
