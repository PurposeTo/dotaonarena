import { Invade } from "./Invade";

export class Waves {

    private readonly restTime: number;

    private readonly invade: Invade;

    constructor(invade: Invade, restTime: number) {
        this.invade = invade;
        this.restTime = restTime;

        ListenToGameEvent("game_rules_state_change", () => this.CheckStateAndStartWaves(), undefined);
        this.invade.listenOnWaveDefeated(() => this.WaitRestAndStartNewWave());
    }

    private WaitRestAndStartNewWave() {
        print("Wave defeated. You can rest for " + this.restTime + "s");
        Timers.CreateTimer(this.restTime, () => this.invade.StartNewWave());
    }

    private CheckStateAndStartWaves(): void {
        const state = GameRules.State_Get();
        if (state == GameState.GAME_IN_PROGRESS) {
            this.invade.StartNewWave();
        }
    }
}
