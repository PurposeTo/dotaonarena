import { DotaRandom } from "../../utils/DotaRandom";
import { TroopDto } from "../troops/dto/TroopDto";
import { IBuildStrategy } from "./IBuildStrategy";
import { StrongStrategy } from "./StrongStrategy";
import { RandomStrategy } from "./RandomStrategy";
import { WeakStrategy } from "./WeakStrategy";


export class WaveBuilder {

    private readonly troopsList: TroopDto[]

    private readonly weakStrategy = new WeakStrategy();
    private readonly strongStrategy = new StrongStrategy();
    private readonly randomStrategy = new RandomStrategy();

    private readonly buildStrategies: IBuildStrategy[] =
        [
            this.weakStrategy,
            this.strongStrategy,
            this.randomStrategy,
        ];


    constructor(troopsList: TroopDto[]) {
        this.troopsList = troopsList;
    }

    Build(wave: number, coins: number, minUnitCost: number): TroopDto[] {
        let troops = Array.from(this.troopsList);
        let strategy: IBuildStrategy;

        // todo вынести в конфиг файл
        if (wave <= 10) {
            strategy = this.weakStrategy;
        }
        else if (wave % 5 == 0) {
            strategy = this.strongStrategy;
        }
        else {
            strategy = this.randomStrategy;
        }

        return strategy.Build(troops, coins, minUnitCost);
    }

}
