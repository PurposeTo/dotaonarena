import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";


export class TroopsShop {

    private readonly troopsList: TroopDto[]


    constructor(troopsList: TroopDto[]) {
        this.troopsList = troopsList;
    }


    // выбрать 1 случайный отряд и составить из него волну
    public BuyRandom(coins: number, minUnitCost: number): TroopDto[] {
        coins = this.ValidateCoins(coins, minUnitCost);

        let available: TroopDto[] = this.troopsList;

        available = this.FilterByMinUnitCost(available, minUnitCost);
        available = this.FilterByCost(available, coins);

        let waveTroop = this.GetRandom(available);
        return this.Collect(waveTroop, coins);
    }

    // выбрать 1 самый дорогой отряд и составить из него волну
    public BuyMostExpensive(coins: number, minUnitCost: number): TroopDto[] {
        coins = this.ValidateCoins(coins, minUnitCost);

        let available: TroopDto[] = this.troopsList;

        available = this.FilterByMinUnitCost(available, minUnitCost);
        available = this.FilterByCost(available, coins);
        available = this.FilterMostExpensive(available);

        let waveTroop = this.GetRandom(available);
        return this.Collect(waveTroop, coins);
    }


    private GetRandom(available: TroopDto[]): TroopDto {
        if (available.length == 0) {
            print("ERROR! Can't find valid troop for wave");
            return DotaRandom.randomArrayValue(this.troopsList);
        }

        return DotaRandom.randomArrayValue(available);
    }

    // Купить одинаковые отряды на все монеты
    private Collect(troop: TroopDto, coins: number): TroopDto[] {
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
    private FilterMostExpensive(troops: TroopDto[]): TroopDto[] {
        if (troops.length == 0) {
            print("ERROR! TroopsShop.GetMostExpensive input is empty!");
        }

        let highestCost = this.GetHighestTroopCost(troops);
        return troops.filter(troop => troop.GetCost() == highestCost);
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
