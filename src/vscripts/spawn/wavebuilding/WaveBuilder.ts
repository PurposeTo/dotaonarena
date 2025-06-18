import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";
import { IBuildStrategy } from "./IBuildStrategy";
import { StrongStrategy } from "./StrongStrategy";
import { RandomStrategy } from "./RandomStrategy";
import { WeakStrategy } from "./WeakStrategy";


export class WaveBuilder {

    private readonly troopsList: TroopDto[]

    private readonly weakStrategy = new WeakStrategy();

    private readonly buildStrategies: IBuildStrategy[] =
        [
            this.weakStrategy,
            new RandomStrategy(),
            new StrongStrategy(),
        ];


    constructor(troopsList: TroopDto[]) {
        this.troopsList = troopsList;
    }

    Build(wave: number, coins: number, minUnitCost: number): TroopDto[] {
        let troops = Array.from(this.troopsList);
        let strategy: IBuildStrategy;

        // todo вынести в конфиг файл
        if (wave <= 5) {
            strategy = this.weakStrategy;
        }
        else {
            strategy = DotaRandom.randomArrayValue(this.buildStrategies);
        }

        return strategy.Build(troops, coins, minUnitCost);
    }

}
