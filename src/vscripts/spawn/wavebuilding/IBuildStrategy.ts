import { TroopDto } from "../troops/dto/TroopDto";

export interface IBuildStrategy {

    Build(troops: TroopDto[], coins: number, minUnitCost: number): TroopDto[];
}
