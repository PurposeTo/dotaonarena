import { reloadable } from "../lib/tstl-utils";

@reloadable
export class UnitCreator {


    public CreateUnitByName(unitName: string, point: CBaseEntity, team: DotaTeam): CDOTA_BaseNPC_Creature {
        const location = point.GetAbsOrigin();
        const unit = CreateUnitByName(unitName, location, true, undefined, undefined, team) as CDOTA_BaseNPC_Creature;
        unit.SetInitialGoalEntity(point);
        return unit;
    }
}
