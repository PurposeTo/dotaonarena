import { reloadable } from "../lib/tstl-utils";

@reloadable
export class GameStateListener {


    constructor() {
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
    }

    private OnStateChange(): void {
        const state = GameRules.State_Get();
        const name = GameStateText[state]
        print("On state change: " + name)

        if (state == GameState.GAME_IN_PROGRESS) {
            this.StartGame();
        }

    }

    private StartGame(): void {
        print("Game starting!");
    }
}

enum GameStateText {
    INIT = 0,
    WAIT_FOR_PLAYERS_TO_LOAD = 1,
    CUSTOM_GAME_SETUP = 2,
    PLAYER_DRAFT = 3,
    HERO_SELECTION = 4,
    STRATEGY_TIME = 5,
    TEAM_SHOWCASE = 6,
    WAIT_FOR_MAP_TO_LOAD = 7,
    PRE_GAME = 8,
    SCENARIO_SETUP = 9,
    GAME_IN_PROGRESS = 10,
    POST_GAME = 11,
    DISCONNECT = 12,
}
