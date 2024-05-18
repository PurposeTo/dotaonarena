import { reloadable } from "./lib/tstl-utils";
import { GameStateListener } from "./listeners/GameStateListener";

const autoLaunchDelay = 5;
const heroSelectionTime = 20;
const preGameDelay = 5;

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {

        
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        const gameState = new GameStateListener();
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 0);

        GameRules.LockCustomGameSetupTeamAssignment(true);
        GameRules.SetCustomGameSetupAutoLaunchDelay(autoLaunchDelay)

        GameRules.SetHeroSelectionTime(heroSelectionTime)
	    GameRules.SetStrategyTime(0)
	    GameRules.SetShowcaseTime(0)
	    GameRules.SetPreGameTime(preGameDelay)

        GameRules.SetUseUniversalShopMode(true)

        const gameModeEntity = GameRules.GetGameModeEntity();
	    gameModeEntity.SetAnnouncerDisabled(true);
    }

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }
}
