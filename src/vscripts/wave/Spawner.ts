import { reloadable } from "../lib/tstl-utils";

@reloadable
export class Spawner {
    private static readonly WAVE_TEAM: DotaTeam = DotaTeam.BADGUYS;
    private static readonly MOB_NAME: string = "npc_dota_neutral_kobold";
    private static readonly SPAWN_POINT_NAME: string = "enemy_path_point1";
    private static readonly CREATURE_LEVEL: number = 3;

    private aliveMobs: CDOTA_BaseNPC_Creature[] = [];

    private callback: (this: void) => void;

    constructor(callback: (this: void) => void) {
        this.callback = callback;

        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);
    }

    private OnEntityKilled(data: EntityKilledEvent): void {
        const unit = EntIndexToHScript(data.entindex_killed)!;

        this.aliveMobs = this.aliveMobs.filter((e, i) => {
            return e.IsAlive();
        });

        if(this.aliveMobs.length == 0) {
            this.callback();
        }
    }
    
    public SpawnMobsWithDelay(count: number, delay: number): void {
        let currentCount : number = 0

        Timers.CreateTimer(() => {
            this.SpawnMobs(1)
            currentCount = currentCount + 1

            if (currentCount < count) {
                return delay;
            }
            else {
                return undefined;
            }
        });
    }

    public CreateUnitByName(unitName: string, point: CBaseEntity, team: DotaTeam): CDOTA_BaseNPC_Creature {
        const location = point.GetAbsOrigin();
        const unit = CreateUnitByName(unitName, location, true, undefined, undefined, team) as CDOTA_BaseNPC_Creature;
        unit.SetInitialGoalEntity(point);
        return unit;
    }

    public SpawnMobs(count: number): void {
        for (let i = 0; i < count; i++) {
            const point = Entities.FindByName(undefined, Spawner.SPAWN_POINT_NAME)!;
            const unit = this.CreateUnitByName(Spawner.MOB_NAME, point, Spawner.WAVE_TEAM);
            this.aliveMobs.push(unit);

            unit.CreatureLevelUp(Spawner.CREATURE_LEVEL);
        }
    }
}
