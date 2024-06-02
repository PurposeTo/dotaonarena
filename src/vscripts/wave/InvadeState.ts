import { reloadable } from "../lib/tstl-utils";
import { SpawnPoint } from "../spawn/SpawnPoint";
import { WaveConfig } from "./WaveConfig";

@reloadable
export class InvadeState {

    // configs
    private static readonly SPAWN_POINT_NAME: string = "enemy_path_point1";
    private static readonly WAVE_MOBS_COUNT = 10;
    private static SHOP_NAME = "global_shop";

    private waveConfig: WaveConfig = new WaveConfig();

    private spawn: SpawnPoint;

    private onStateEnd: Runnable = () => { };
    private shopTrigger: CBaseTrigger;

    private waveNumber: number = 0; // значение по умолчанию

    constructor() {
        this.spawn = new SpawnPoint(InvadeState.SPAWN_POINT_NAME);
        this.spawn.listenOnAllMobsKilled(() => this.onStateEnd());
        this.spawn.listenOnMobSpawned(unit => this.ConfigureMob(unit));

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

    private SpawnWaveMobs(): void {
       const groups = this.waveConfig.FindWaveGroups();

       groups.forEach(group => {
        print("spawn group: " + group)
        const units = this.waveConfig.FindGroupUnits(group);
        print("group units: ")
        DeepPrintTable(units)
        this.spawn.SpawnAll(units);
       });
    }

    private ConfigureMob(unit: CDOTA_BaseNPC_Creature): void {
        const plusLevel: number = math.max(this.waveNumber, 1) * 3;
        unit.CreatureLevelUp(plusLevel);
    }

    private OnAllMobsInvaded() {
        // пока ничего не делать
    }
}
