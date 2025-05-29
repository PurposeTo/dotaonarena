import { Troop } from "../Troop";
import { UnitsDto } from "./UnitsDto";

export class TroopDto {

    private name: string;
    private powerCost: number;
    private units: UnitsDto[];
    

    constructor(name: string, powerCost: number, units: UnitsDto[]) {
        this.name = name;
        this.powerCost = powerCost;
        this.units = units;
    }

    public GetName() {
        return this.name;
    }

    public format() : Troop {
        let unitsFlat: string[] = [];

        this.units.forEach(unit => {
            let count = unit.GetCount();
            let name = unit.GetName();

            for (let i = 0; i < count; i++) {
                unitsFlat.push(name);
            }
        });

        return new Troop(this.powerCost, unitsFlat);
    }
}
