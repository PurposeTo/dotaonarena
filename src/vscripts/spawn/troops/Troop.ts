

export class Troop {

    private readonly _units: string[]
    private readonly _count: number

    constructor(units: string[]) {
        this._units = units
        this._count = units.length
    }

    public GetUnits() {
        return this._units;
    }

    public GetCount() {
        return this._count;
    }
}
