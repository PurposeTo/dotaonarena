import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";


export class TroopsBuyer {

    private readonly troopsList: TroopDto[]


    constructor(troopsList: TroopDto[]) {
        this.troopsList = troopsList;
    }




    // собрать наиболее дорогие отряды 
    public buyMostExpensive(coins: number): TroopDto[] {
        let out: TroopDto[] = [];
        let remaining: number = coins;
        let available: TroopDto[] = this.troopsList;

        while(true) {
            // отряды, которые стоят столько же или меньше, чем есть монет
            available = available.filter(troop => troop.GetCost() <= remaining);
            if(available.length == 0) break;
    
            let troop = this.findMostExpensive(available);
            remaining -= troop.GetCost();
            out.push(troop);
        }

        return out;
    }

    // Найти отряды с самой высокой стоимостью и вернуть один случайный
    public findMostExpensive(troops: TroopDto[]): TroopDto {
        // самая высокая стоимость отряда
        let highestCost: number = troops
            .sort(troop => troop.GetCost())
            .shift()!
            .GetCost();

        let highestCostTroops = troops.filter(troop => troop.GetCost() == highestCost);
        return DotaRandom.randomArrayValue(highestCostTroops);
    }
}
