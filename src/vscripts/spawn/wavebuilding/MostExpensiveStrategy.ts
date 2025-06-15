import { TroopDto } from "../troops/dto/TroopDto";
import { IBuildStrategy } from "./IBuildStrategy";
import { WaveBuilderUtils } from "./WaveBuilderUtils";

export class MostExpensiveStrategy implements IBuildStrategy {

    // выбрать 1 самый дорогой отряд и составить из него волну
    Build(troops: TroopDto[], coins: number, minUnitCost: number): TroopDto[] {
        coins = WaveBuilderUtils.ValidateCoins(coins, minUnitCost);

        let available: TroopDto[] = troops;

        available = WaveBuilderUtils.FilterByMinUnitCost(available, minUnitCost);
        available = WaveBuilderUtils.FilterByCost(available, coins);
        available = WaveBuilderUtils.FilterMostExpensive(available);

        let waveTroop = WaveBuilderUtils.GetRandom(available, troops);
        return WaveBuilderUtils.Collect(waveTroop, coins);
    }

}
