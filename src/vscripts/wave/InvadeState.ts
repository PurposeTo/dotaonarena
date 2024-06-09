import { reloadable } from "../lib/tstl-utils";
import { Shop } from "../shop/Shop";
import { ISpawnPoint } from "../spawn/ISpawnPoint";
import { SpawnPoint } from "../spawn/SpawnPoint";
import { SpawnPoints } from "../spawn/SpawnPoints";
import { WaveConfig } from "./WaveConfig";

@reloadable
export class InvadeState {

    // configs
    private static readonly SPAWN_POINT_NAME: string = "enemy_path_point1";

    private static readonly WAVE_MOB_MODIFIER: number = 1;

    private waveConfig: WaveConfig = new WaveConfig();

    private spawn: SpawnPoint;
    private shop = new Shop();

    private onStateEnd: Runnable = () => { };
    private waveNumber: number = 0; // значение по умолчанию

    constructor() {
        //todo: use
        const spawnPoints: ISpawnPoint = SpawnPoints.fromConfig();

        const point: CBaseEntity = assert(Entities.FindByName(undefined, InvadeState.SPAWN_POINT_NAME));
        this.spawn = new SpawnPoint(point);
        this.spawn.listenOnAllMobsKilled(() => this.onStateEnd());
        this.spawn.listenOnMobSpawned(unit => this.ConfigureMob(unit));
    }

    public Listen(onStateEnd: Runnable) {
        this.onStateEnd = onStateEnd;
    }

    public StartState(waveNumber: number) {
        print("Current wave is " + waveNumber);
        this.waveNumber = waveNumber;

        if (!IsInToolsMode()) {
            this.shop.Close();
        }

        this.SpawnWaveMobs();
    }

    private SpawnWaveMobs(): void {
        const groups = this.waveConfig.FindWaveGroups(this.waveNumber);

        groups.forEach(group => {
            const units = this.waveConfig.FindGroupUnits(group);
            this.spawn.SpawnAll(units);
        });
    }

    private ConfigureMob(unit: CDOTA_BaseNPC_Creature): void {
        const plusLevel: number = this.waveNumber * InvadeState.WAVE_MOB_MODIFIER;
        if (plusLevel == 0) return;
        unit.CreatureLevelUp(plusLevel);
    }

    private OnAllMobsInvaded() {
        // пока ничего не делать
    }
}
