import { KvReader } from "../utils/KvReader";

export class GameModeProperties {
    private static readonly PATH: string = "scripts/npc/gamemode/game_mode_properties.txt";
    private static readonly PATH_DEV: string = "scripts/npc/gamemode/game_mode_properties_dev.txt";

    private _teamMaxPlayers: number;
    private _autoLaunchDelay: number;
    private _heroSelectionTime: number;
    private _strategyTime: number;
    private _showcaseTime: number;
    private _preGameDelay: number;
    private _startGold: number;


    constructor(
        teamMaxPlayers: number,
        autoLaunchDelay: number,
        heroSelectionTime: number,
        strategyTime: number,
        showcaseTime: number,
        preGameDelay: number,
        startGold: number
    ) {
        this._teamMaxPlayers = teamMaxPlayers;
        this._autoLaunchDelay = autoLaunchDelay;
        this._heroSelectionTime = heroSelectionTime;
        this._strategyTime = strategyTime;
        this._showcaseTime = showcaseTime;
        this._preGameDelay = preGameDelay;
        this._startGold = startGold;
    }

    public static fromMap(map: Map<string, any>): GameModeProperties {
        return new GameModeProperties(
            map.get("TEAM_MAX_PLAYERS")!,
            map.get("AUTO_LAUNCH_DELAY")!,
            map.get("HERO_SELECTION_TIME")!,
            map.get("STRATEGY_TIME")!,
            map.get("SHOWCASE_TIME")!,
            map.get("PRE_GAME_DELAY")!,
            map.get("START_GOLD")!,
        );
    }

    public static Read(): GameModeProperties {
        let map = KvReader.readProperties(GameModeProperties.PATH, GameModeProperties.PATH_DEV);
        let out = GameModeProperties.fromMap(map);
        return out;
    }

    public get teamMaxPlayers(): number {
        return this._teamMaxPlayers;
    }

    public set teamMaxPlayers(value: number) {
        this._teamMaxPlayers = value;
    }

    public get autoLaunchDelay(): number {
        return this._autoLaunchDelay;
    }

    public set autoLaunchDelay(value: number) {
        this._autoLaunchDelay = value;
    }

    public get heroSelectionTime(): number {
        return this._heroSelectionTime;
    }

    public set heroSelectionTime(value: number) {
        this._heroSelectionTime = value;
    }

    public get strategyTime(): number {
        return this._strategyTime;
    }

    public set strategyTime(value: number) {
        this._strategyTime = value;
    }

    public get showcaseTime(): number {
        return this._showcaseTime;
    }

    public set showcaseTime(value: number) {
        this._showcaseTime = value;
    }

    public get preGameTime(): number {
        return this._preGameDelay;
    }

    public set preGameTime(value: number) {
        this._preGameDelay = value;
    }

    public get startGold(): number {
        return this._startGold;
    }

    public set startGold(value: number) {
        this._startGold = value;
    }

}
