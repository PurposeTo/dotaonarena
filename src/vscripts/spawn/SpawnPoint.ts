import { GlobalConstants } from "../GlobalConstants";
import { reloadable } from "../lib/tstl-utils";
import { UnitCreator } from "./UnitCreator";


// Спавнит юнитов в заранее заданной точке на карте
@reloadable
export class SpawnPoint {

    private static readonly ENEMY_TEAM: DotaTeam = GlobalConstants.ENEMY_TEAM;

    private readonly _point: CBaseEntity;
    private readonly _unitCreator: UnitCreator;

    private _unitsQueue: string[] = [];

    private onMobSpawned: Action<CDOTA_BaseNPC_Creature> = (unit) => { }

    constructor(point: CBaseEntity) {
        this._point = point;
        this._unitCreator = new UnitCreator();
    }

    public listenOnMobSpawned(action: Action<CDOTA_BaseNPC_Creature>) {
        this.onMobSpawned = action;
    }

    public Spawn(unit: string) {
        this._unitsQueue.push(unit);

        this.SpawnFromQueue();
    }

    public SpawnAll(units: string[]) {
        this._unitsQueue.push(...units);

        this.SpawnFromQueue();
    }

    private SpawnFromQueue() {
        this._unitsQueue.forEach((unitName) => {
            assert(unitName);
            const unit = this._unitCreator.CreateUnitByName(unitName, this._point, SpawnPoint.ENEMY_TEAM);
            this.onMobSpawned(unit);
        });

        this._unitsQueue = [];
    }
}
