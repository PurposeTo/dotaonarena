

export class Troop {

    private readonly _creaturesPowerCost: number
    private readonly _units: string[]
    private readonly _count: number

    constructor(creaturesPowerCost: number, units: string[]) {
        this._creaturesPowerCost = creaturesPowerCost
        this._units = units
        this._count = units.length
    }

    public GetCost() {
        return this._creaturesPowerCost
    }

    public GetUnits() {
        return this._units;
    }

    public GetCount() {
        return this._count;
    }
}
