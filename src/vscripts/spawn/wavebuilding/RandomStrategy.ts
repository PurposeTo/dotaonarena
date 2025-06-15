import { TroopDto } from "../troops/dto/TroopDto";
import { IBuildStrategy } from "./IBuildStrategy";
import { WaveBuilderUtils } from "./WaveBuilderUtils";

export class RandomStrategy implements IBuildStrategy {


    // выбрать 1 случайный отряд и составить из него волну
    Build(troops: TroopDto[], coins: number, minUnitCost: number): TroopDto[] {
        coins = WaveBuilderUtils.ValidateCoins(coins, minUnitCost);

        let available: TroopDto[] = troops;

        available = WaveBuilderUtils.FilterByMinUnitCost(available, minUnitCost);
        available = WaveBuilderUtils.FilterByCost(available, coins);

        let waveTroop = WaveBuilderUtils.GetRandom(available, troops);
        return WaveBuilderUtils.Collect(waveTroop, coins);
    }
}
