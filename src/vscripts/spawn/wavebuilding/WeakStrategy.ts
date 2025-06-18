import { TroopDto } from "../troops/dto/TroopDto";
import { IBuildStrategy } from "./IBuildStrategy";
import { WaveBuilderUtils } from "./WaveBuilderUtils";


export class WeakStrategy implements IBuildStrategy {


    Build(troops: TroopDto[], coins: number, minUnitCost: number): TroopDto[] {
        coins = WaveBuilderUtils.ValidateCoins(coins, minUnitCost);

        print("WeakStrategy")

        let available: TroopDto[] =  Array.from(troops);

        available = WaveBuilderUtils.FilterByMinUnitCost(available, minUnitCost);
        available = WaveBuilderUtils.FilterByCost(available, coins);
        available = WaveBuilderUtils.FilterWeakest(available);

        DeepPrintTable(available)

        let waveTroop = WaveBuilderUtils.GetRandom(available, troops);
        return WaveBuilderUtils.Collect(waveTroop, coins);
    }

}