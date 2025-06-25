import { KvReader } from "../../../utils/KvReader";
import { TroopDto } from "../dto/TroopDto";
import { UnitsDto } from "../dto/UnitsDto";

export class TroopsReader {
    private static readonly PATH: string = "scripts/npc/spawn/troops/troops.txt";

    private static readonly COST: string = "cost";
    private static readonly UNITS: string = "units";


    public Read(): TroopDto[] {
        const rawMap = KvReader.readAsMap(TroopsReader.PATH);
        return this.MapTroops(rawMap);
    }

    private MapTroops(rawMap: Map<any, any>): TroopDto[] {
        let mappedTroops = [];
        for (const [troopName, troop] of rawMap) {
            const troopMap = KvReader.formatKVToMap(troop);

            let cost = troopMap.get(TroopsReader.COST) as number;
            let units = troopMap.get(TroopsReader.UNITS) as any;
            let unitsMap = KvReader.formatKVToMap(units);

            let mappedUnits = this.MapUnits(unitsMap);

            let mappedTroop = new TroopDto(troopName, cost, mappedUnits);
            mappedTroops.push(mappedTroop);
        }
        return mappedTroops;
    }

    private MapUnits(rawUnits: Map<any, any>): UnitsDto[] {
        let mappedUnits = [];
        for (const [unitName, count] of rawUnits.entries()) {

            mappedUnits.push(new UnitsDto(unitName, count));
        }

        return mappedUnits;
    }
}
