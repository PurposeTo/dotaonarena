import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";
import { IBuildStrategy } from "./IBuildStrategy";
import { MostExpensiveStrategy } from "./MostExpensiveStrategy";
import { RandomStrategy } from "./RandomStrategy";


export class WaveBuilder {

    private readonly troopsList: TroopDto[]

    private readonly buildStrategies: IBuildStrategy[] =
        [
            new RandomStrategy(),
            new MostExpensiveStrategy()
        ]


    constructor(troopsList: TroopDto[]) {
        this.troopsList = troopsList;
    }

    Build(coins: number, minUnitCost: number): TroopDto[] {
        let strategy = DotaRandom.randomArrayValue(this.buildStrategies);
        return strategy.Build(this.troopsList, coins, minUnitCost);
    }

}
