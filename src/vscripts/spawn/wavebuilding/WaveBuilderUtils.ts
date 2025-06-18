import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";


export class WaveBuilderUtils {


    public static GetRandom(troops: TroopDto[], deflt: TroopDto[]): TroopDto {
        troops = Array.from(troops);

        if (troops.length == 0) {
            print("ERROR! WaveBuilderUtils.GetRandom input is empty");
            return DotaRandom.randomArrayValue(deflt);
        }

        return DotaRandom.randomArrayValue(troops);
    }

    // Купить одинаковые отряды на все монеты
    public static Collect(troop: TroopDto, coins: number): TroopDto[] {
        let out: TroopDto[] = [];

        let troopCost = troop.GetCost();
        troopCost = Math.max(1, troopCost);

        let count = coins / troopCost;

        count = Math.max(1, count);
        count = Math.trunc(count);

        for (let index = 0; index < count; index++) {
            out.push(troop);
        }

        return out;
    }

    // Найти отряды с самой высокой стоимостью и вернуть один случайный
    public static FilterStrongest(troops: TroopDto[]): TroopDto[] {
        troops = Array.from(troops);

        if (troops.length == 0) {
            print("ERROR! TroopsShop.FilterStrongest input is empty!");
        }

        let cost = this.GetStrongestCost(troops);
        return troops.filter(troop => troop.GetCost() == cost);
    }

    // Найти отряды с самой низкой стоимостью и вернуть один случайный
    public static FilterWeakest(troops: TroopDto[]): TroopDto[] {
        troops = Array.from(troops);

        if (troops.length == 0) {
            print("ERROR! TroopsShop.FilterWeakest input is empty!");
        }

        let cost = this.GetWeakestCost(troops);
        print("Weakest cost is " + cost);
        return troops.filter(troop => troop.GetCost() == cost);
    }

    // Получить самую высокую стоимость отряда
    public static GetStrongestCost(troops: TroopDto[]): number {
        troops = Array.from(troops);

        return this.SortDescCost(troops)
            .shift()!
            .GetCost();
    }

    public static GetWeakestCost(troops: TroopDto[]): number {
        troops = Array.from(troops);

        return this.SortAscCost(troops)
            .shift()!
            .GetCost();
    }

    public static ValidateCoins(coins: number, minUnitCost: number) {
        if (coins < minUnitCost) {
            print("WARN! Coins is less then min unit cost. " + coins + " < " + minUnitCost);
            return minUnitCost;
        }

        return coins;
    }

    // выбрать отряды, которые стоят не меньше, чем minUnitCost
    public static FilterByMinUnitCost(troops: TroopDto[], minUnitCost: number): TroopDto[] {
        troops = Array.from(troops);

        let out = troops.filter(troop => troop.GetCost() >= minUnitCost);
        if (out.length == 0) {
            print("WARN! Can't find troop with cost >= " + minUnitCost + ", then min unit cost");
            out = troops;
        }

        return out;
    }

    // выбрать отряды, которые стоят столько же или меньше, чем cost
    public static FilterByCost(troops: TroopDto[], cost: number) {
        troops = Array.from(troops);

        let out = troops.filter(troop => troop.GetCost() <= cost);

        if (out.length == 0) {
            print("WARN! Can't find troop with cost <= " + cost);
            out = troops;
        }

        return out;
    }

    public static SortDescCost(troops: TroopDto[]) {
        troops = Array.from(troops);

        return troops.sort((a, b) => b.GetCost() - a.GetCost());
    }

    public static SortAscCost(troops: TroopDto[]) {
        troops = Array.from(troops);

        return troops.sort((a, b) => a.GetCost() - b.GetCost());
    }

}
