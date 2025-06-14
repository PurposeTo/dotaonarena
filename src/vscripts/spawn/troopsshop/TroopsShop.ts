import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";


export class TroopsShop {

    private readonly troopsList: TroopDto[]


    constructor(troopsList: TroopDto[]) {
        this.troopsList = troopsList;
    }


    // собрать одинаковые отряды
    public BuySameTroops(coins: number, minUnitCost: number): TroopDto[] {
        let available: TroopDto[] = this.troopsList;

        let waveTroop: TroopDto;
        available = this.FilterByMinUnitCost(available, minUnitCost);
        available = this.FilterByCost(available, coins);

        if (available.length == 0) {
            print("ERROR! Can't find valid troop for wave");
            waveTroop = DotaRandom.randomArrayValue(this.troopsList);
        }

        waveTroop = DotaRandom.randomArrayValue(available);

        return this.CollectTroops(waveTroop, coins);
    }


    // собрать наиболее дорогие отряды 
    public BuyMostExpensive(coins: number, minUnitCost: number): TroopDto[] {
        let out: TroopDto[] = [];
        let remaining: number = coins;
        let available: TroopDto[] = this.troopsList;

        coins = this.ValidateCoins(coins, minUnitCost);

        while (true) {
            available = this.FilterByMinUnitCost(available, minUnitCost);
            available = this.FilterByCost(available, remaining);

            if (available.length == 0) break;

            let troop = assert(this.FindMostExpensive(available));
            remaining -= troop.GetCost();
            out.push(troop);
        }

        return out;
    }

    // Собрать волну из одного и того же отряда
    private CollectTroops(troop: TroopDto, coins: number): TroopDto[] {
        let out: TroopDto[] = [];

        let troopCost = troop.GetCost();
        troopCost = Math.min(1, troopCost);

        let count = coins / troopCost;

        count = Math.max(1, count);
        count = Math.trunc(count);

        for (let index = 0; index < count; index++) {
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

    private ValidateCoins(coins: number, minUnitCost: number) {
        if (coins < minUnitCost) {
            print("WARN! Coins is less then min unit cost. " + coins + " < " + minUnitCost);
            return minUnitCost;
        }

        return coins;
    }

    // выбрать отряды, которые стоят не меньше, чем minUnitCost
    private FilterByMinUnitCost(troops: TroopDto[], minUnitCost: number): TroopDto[] {
        let out = troops.filter(troop => troop.GetCost() >= minUnitCost);
        if (out.length == 0) {
            print("WARN! Can't find troop with cost >= " + minUnitCost);
            out = troops;
        }

        return out;
    }

    // выбрать отряды, которые стоят столько же или меньше, чем cost
    private FilterByCost(troops: TroopDto[], cost: number) {
        return troops.filter(troop => troop.GetCost() <= cost);
    }
}
