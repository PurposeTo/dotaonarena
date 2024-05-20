import { GlobalConstants } from "../GlobalConstants";
import { reloadable } from "../lib/tstl-utils";

@reloadable
export class Spawner {

    // configs
    private static readonly MOB_NAME: string = "npc_dota_neutral_kobold";
    private static readonly TEAM: DotaTeam = GlobalConstants.ENEMY_TEAM;
    private static readonly SPAWN_POINT_NAME: string = "enemy_path_point1";

    private mobs: CDOTA_BaseNPC_Creature[] = [];

    public GetMobs() {
        return this.mobs;
    }

    public Clear() {
        this.mobs = [];
    }

    public SpawnMobsWithDelayAsync(
        count: number,
        delay: number,
        onMobSpawned: Action<CDOTA_BaseNPC_Creature>,
        onAllMobsSpawned: Runnable
    ): void {
        let currentCount: number = 0
        Timers.CreateTimer(() => {
            const unit = this.SpawnMob();
            currentCount = currentCount + 1

            this.mobs.push(unit);
            onMobSpawned(unit);
            if (currentCount < count) {
                return delay;
            }
            else {
                onAllMobsSpawned();
                return undefined;
            }
        });
    }

    public SpawnMobs(count: number): CDOTA_BaseNPC_Creature[] {
        const mobs: CDOTA_BaseNPC_Creature[] = [];

        for (let i = 0; i < count; i++) {
            const unit = this.SpawnMob();
            mobs.push(unit);
        }

        return mobs;
    }

    public SpawnMob(): CDOTA_BaseNPC_Creature {
        const point = Entities.FindByName(undefined, Spawner.SPAWN_POINT_NAME)!;
        const unit = this.CreateUnitByName(Spawner.MOB_NAME, point, Spawner.TEAM)!;
        return unit;
    }

    public CreateUnitByName(unitName: string, point: CBaseEntity, team: DotaTeam): CDOTA_BaseNPC_Creature {
        const location = point.GetAbsOrigin();
        const unit = CreateUnitByName(unitName, location, true, undefined, undefined, team) as CDOTA_BaseNPC_Creature;
        unit.SetInitialGoalEntity(point);
        return unit;
    }
}