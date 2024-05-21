import { reloadable } from "../lib/tstl-utils";
import { InvadeState } from "./InvadeState";
import { RestState } from "./RestState";

@reloadable
export class WaveSpawn {

    private restState: RestState;
    private invadeState: InvadeState;

    // номер волны начинается с нуля
    private waveNumber: number = 0;

    constructor() {
        this.restState = new RestState();
        this.invadeState = new InvadeState();

        this.restState.Listen(() => {
            this.invadeState.StartState(this.waveNumber)
        });
        this.invadeState.Listen(() =>{
            this.waveNumber = this.waveNumber + 1;
            this.restState.StartState();
        });

        ListenToGameEvent("game_rules_state_change", () => this.StartWaves(), undefined);
    }

    private StartWaves(): void {
        const state = GameRules.State_Get();
        if (state == GameState.GAME_IN_PROGRESS) {
            this.invadeState.StartState(this.waveNumber);
        }
    }
}

enum WaveState {
    REST,
    INVADE
}
