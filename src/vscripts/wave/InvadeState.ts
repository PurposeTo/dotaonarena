import { reloadable } from "../lib/tstl-utils";
import { Spawner } from "../utils/Spawner";
import { WaveConfig } from "./WaveConfig";

@reloadable
export class InvadeState {

    // configs
    private static readonly WAVE_MOBS_COUNT = 10;
    private static readonly INVADE_DELAY = 1;
    private static SHOP_NAME = "global_shop";

    private spawner: Spawner;

    private onStateEnd: Runnable = () => { };
    private shopTrigger: CBaseTrigger;

    private waveNumber: number = 0; // значение по умолчанию

    constructor() {
        this.spawner = new Spawner();

        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);

        this.shopTrigger = Entities.FindByName(undefined, InvadeState.SHOP_NAME)! as CBaseTrigger;
    }

    public Listen(onStateEnd: Runnable) {
        this.onStateEnd = onStateEnd;
    }

    public StartState(waveNumber: number) {
        print("Current wave is " + waveNumber);
        this.waveNumber = waveNumber;
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
        new WaveConfig().FindWaveMobs(); //todo

        this.spawner.SpawnMobsWithDelayAsync(
            InvadeState.WAVE_MOBS_COUNT,
            InvadeState.INVADE_DELAY,
            (c) => this.ConfigureMob(c),
            () => this.OnAllMobsInvaded()
        )
    }

    private ConfigureMob(unit: CDOTA_BaseNPC_Creature): void {
        print("unit is null: " + unit.IsNull())
        print("is creature: " + unit.IsCreature())
        const plusLevel: number = math.max(this.waveNumber, 1) * 3;
        print("unit level up: " + plusLevel)
        unit.CreatureLevelUp(plusLevel);
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
