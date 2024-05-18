import { reloadable } from "../lib/tstl-utils";

@reloadable
export class GameStateListener {


    constructor() {
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();
        const name = GameStateText[state]
        print("On state change: " + name)

        if (state == GameState.GAME_IN_PROGRESS) {
            this.StartGame();
        }

    }

    private StartGame(): void {
        print("Game starting!");
        this.WaveMobs();
        // Do some stuff here
    }

    private WaveMobs(): void {
        print("Wave mobs");
        this.SpawnMobsWithDelay(10, 1)
    }

    private SpawnMobsWithDelay(count: number, delay: number): void {
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

    private SpawnMobs(count: number): void {
        for (let i = 0; i < count; i++) {
            const point = Entities.FindByName(undefined, "enemy_path_point1")!;
            const location = point.GetAbsOrigin();
            const unit = CreateUnitByName("npc_dota_neutral_kobold", location, true, undefined, undefined, DotaTeam.BADGUYS) as CDOTA_BaseNPC_Creature;
            unit.SetInitialGoalEntity(point);
            unit.CreatureLevelUp(3);
        }
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
