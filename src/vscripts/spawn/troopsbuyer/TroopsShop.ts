import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";


export class TroopsShop {

    private readonly troopsList: TroopDto[]


    constructor(troopsList: TroopDto[]) {
        this.troopsList = troopsList;
    }


    // собрать наиболее дорогие отряды 
    public BuyMostExpensive(coins: number, minUnitCost: number): TroopDto[] {
        let out: TroopDto[] = [];
        let remaining: number = coins;
        let available: TroopDto[] = this.troopsList;

        let highestCost = this.GetHighestTroopCost(available);

        if (highestCost < minUnitCost) {
            print("ERROR! Wave min unit cost is less then troops highest cost. " + highestCost + " < " + minUnitCost);
            minUnitCost = highestCost;
        }

        if (coins < minUnitCost) {
            print("ERROR! Coins is less then min unit cost. " + coins + " < " + minUnitCost);
            coins = minUnitCost;
        }

        while (true) {
            available = available
                .filter(troop => troop.GetCost() >= minUnitCost) // стоят не меньше, чем minUnitCost
                .filter(troop => troop.GetCost() <= remaining); // отряды, которые стоят столько же или меньше, чем есть монет

            if (available.length == 0) break;

            let troop = assert(this.FindMostExpensive(available));
            remaining -= troop.GetCost();
            out.push(troop);
        }

        return out;
    }

    // Найти отряды с самой высокой стоимостью и вернуть один случайный
    private FindMostExpensive(troops: TroopDto[]): TroopDto {
        if (troops.length == 0) {
            print("ERROR! TroopsShop.FindMostExpensive input is empty!");
        }

        // sort DESC
        troops = troops.sort((a, b) => b.GetCost() - a.GetCost());
        let highestCost = troops[0].GetCost();

        let highestCostTroops: TroopDto[] = troops.filter(troop => troop.GetCost() == highestCost);

        if (highestCostTroops.length == 0) {
            print("ERROR! Can't find highestCostTroops!");
            highestCostTroops = troops;
        }

        return DotaRandom.randomArrayValue(highestCostTroops);
    }

    // Получить самую высокую стоимость отряда
    private GetHighestTroopCost(troops: TroopDto[]): number {
        return troops
            .sort(troop => troop.GetCost())
            .shift()!
            .GetCost();
    }
}
