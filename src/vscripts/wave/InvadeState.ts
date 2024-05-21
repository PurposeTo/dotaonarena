import { reloadable } from "../lib/tstl-utils";
import { Spawner } from "../utils/Spawner";

@reloadable
export class InvadeState {

    // configs
    private static readonly WAVE_MOBS_COUNT = 10;
    private static readonly INVADE_DELAY = 1;
    private static readonly CREATURE_LEVEL: number = 3;
    private static SHOP_NAME = "global_shop";

    private spawner: Spawner;

    private onStateEnd: Runnable = () => { };
    private shopTrigger: CBaseTrigger;


    constructor() {
        this.spawner = new Spawner();

        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);

        this.shopTrigger = Entities.FindByName(undefined, InvadeState.SHOP_NAME)! as CBaseTrigger;
    }

    public Listen(onStateEnd: Runnable) {
        this.onStateEnd = onStateEnd;
    }

    public StartState() {
        this.shopTrigger.Disable();
        this.SpawnWaveMobs();
    }

    private OnEntityKilled(data: EntityKilledEvent): void {
        const unit = EntIndexToHScript(data.entindex_killed)!;

        const mobs = this.spawner.GetMobs();
        const aliveMobs: CDOTA_BaseNPC_Creature[] = mobs.filter((e) => {
            return !e.IsNull() && e.IsAlive();
        });

        if (aliveMobs.length == 0) {
            this.EndState();
        }
    }

    private SpawnWaveMobs(): void {
        this.spawner.SpawnMobsWithDelayAsync(
            InvadeState.WAVE_MOBS_COUNT,
            InvadeState.INVADE_DELAY,
            this.ConfigureMob,
            this.OnAllMobsInvaded
        )
    }

    private ConfigureMob(unit: CDOTA_BaseNPC_Creature): void {
        unit.CreatureLevelUp(InvadeState.CREATURE_LEVEL);
    }

    private OnAllMobsInvaded() {
        // пока ничего не делать
    }

    private EndState() {
        this.Clear();
        this.onStateEnd();
    }

    private Clear() {
        this.spawner.Clear();
    }
}
