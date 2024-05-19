import { reloadable } from "../lib/tstl-utils";
import { Spawner } from "./Spawner";

@reloadable
export class WaveSpawn {


    private static readonly REST_TIME: number = 20;
    private static readonly WAVE_MOBS_COUNT = 10;
    private static readonly INVADE_DELAY = 1;

    private spawner: Spawner = new Spawner(() => this.RestAndInvade());
    private waveState = WaveState.REST;

    constructor() {
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
    }

    private OnStateChange(): void {
        const state = GameRules.State_Get();
        if (state == GameState.GAME_IN_PROGRESS) {
            this.StartGame();
        }

    }

    private StartGame(): void {
        this.Invade();
    }

    private RestAndInvade(): void {
        this.waveState = WaveState.REST;
        Timers.CreateTimer(WaveSpawn.REST_TIME, () => this.Invade());
    }

    private SpawnWaveMobs(): void {
        this.spawner.SpawnMobsWithDelay(WaveSpawn.WAVE_MOBS_COUNT, WaveSpawn.INVADE_DELAY)
    }

    private Invade(): void {
        this.waveState = WaveState.INVADE;
        this.SpawnWaveMobs();
    }
}

enum WaveState {
    REST,
    INVADE
}