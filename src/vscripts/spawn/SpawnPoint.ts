import { GlobalConstants } from "../GlobalConstants";
import { reloadable } from "../lib/tstl-utils";
import { UnitCreator } from "./UnitCreator";


// Спавнит юнитов в заранее заданной точке на карте
@reloadable
export class SpawnPoint {

    private static readonly ENEMY_TEAM: DotaTeam = GlobalConstants.ENEMY_TEAM;

    private readonly _point: CBaseEntity;
    private readonly _unitCreator: UnitCreator;

    private onUnitSpawned: Action<CDOTA_BaseNPC_Creature> = (unit) => { }

    constructor(point: CBaseEntity) {
        this._point = point;
        this._unitCreator = new UnitCreator();
    }

    public listenOnUnitSpawned(action: Action<CDOTA_BaseNPC_Creature>) {
        this.onUnitSpawned = action;
    }

    public Spawn(unitName: string) {
        const unit = this._unitCreator.CreateUnitByName(unitName, this._point, SpawnPoint.ENEMY_TEAM);
        this.onUnitSpawned(unit);
    }

    public SpawnAll(units: string[]) {
        units.forEach((unitName) => {
            this.Spawn(unitName)
        });
    }
}
