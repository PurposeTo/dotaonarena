import { KvReader } from "../../utils/KvReader";
import { PlayerUtils } from "../../utils/PlayerUtils";

export class WavesProperties {
    private static readonly PATH: string = "scripts/npc/spawn/waves/waves_properties.txt";
    private static readonly PATH_DEV: string = "scripts/npc/spawn/waves/waves_properties_dev.txt";

    private _restTime: number;
    private _maxEnemies: number;
    private _spawnDelay: number;
    private _lvlDefault: number;
    private _lvlKoef: number;
    private _costDefault: number;
    private _costKoef: number;
    private _minUnitCostDefault: number;
    private _minUnitCostKoef: number;
    private _playersCountDifficultyKoef: number;

    private _playersCount: number = 1;

    public constructor(
        restTime: number,
        maxEnemies: number,
        spawnDelay: number,
        lvlDefault: number,
        lvlKoef: number,
        costDefault: number,
        costKoef: number,
        minUnitCostDefault: number,
        minUnitCostKoef: number,
        playersCountDifficultyKoef: number,
    ) {
        this._restTime = restTime;
        this._maxEnemies = maxEnemies;
        this._spawnDelay = spawnDelay;
        this._lvlDefault = lvlDefault;
        this._lvlKoef = lvlKoef;
        this._costDefault = costDefault;
        this._costKoef = costKoef;
        this._minUnitCostDefault = minUnitCostDefault;
        this._minUnitCostKoef = minUnitCostKoef;
        this._playersCountDifficultyKoef = playersCountDifficultyKoef;
    }

    public static fromMap(map: Map<string, any>): WavesProperties {
        return new WavesProperties(
            map.get("REST_TIME")!,
            map.get("MAX_ENEMIES")!,
            map.get("SPAWN_DELAY")!,
            map.get("LVL_DEFAULT")!,
            map.get("LVL_KOEF")!,
            map.get("COST_DEFAULT")!,
            map.get("COST_KOEF")!,
            map.get("MIN_UNIT_COST_DEFAULT")!,
            map.get("MIN_UNIT_COST_KOEF")!,
            map.get("PLAYERS_COUNT_DIFFICULTY_KOEF")!,
        );
    }

    public static Read(): WavesProperties {
        let map = KvReader.readProperties(WavesProperties.PATH, WavesProperties.PATH_DEV);
        let out = WavesProperties.fromMap(map);
        out.playersCount = PlayerUtils.getPlayersCount();
        return out;
    }

    public get restTime(): number {
        return this._restTime;
    }

    public set restTime(value: number | undefined) {
        if (value) this._restTime = value;
    }

    public get maxEnemies(): number {
        return this._maxEnemies;
    }

    public set maxEnemies(value: number | undefined) {
        if (value) this._maxEnemies = value;
    }

    public get spawnDelay(): number {
        return this._spawnDelay;
    }

    public set spawnDelay(value: number | undefined) {
        if (value) this._spawnDelay = value;
    }

    public get lvlDefault(): number {
        return this._lvlDefault;
    }

    public set lvlDefault(value: number | undefined) {
        if (value) this._lvlDefault = value;
    }

    public get lvlKoef(): number {
        return this._lvlKoef * this.playerCountDifficulty;
    }

    public set lvlKoef(value: number | undefined) {
        if (value) this._lvlKoef = value;
    }

    public get costDefault(): number {
        return this._costDefault;
    }

    public set costDefault(value: number | undefined) {
        if (value) this._costDefault = value * this.playerCountDifficulty;
    }

    public get costKoef(): number {
        return this._costKoef * this.playerCountDifficulty;
    }

    public set costKoef(value: number | undefined) {
        if (value) this._costKoef = value;
    }

    public get minUnitCostDefault(): number {
        return this._minUnitCostDefault;
    }

    public set minUnitCostDefault(value: number | undefined) {
        if (value) this._minUnitCostDefault = value;
    }

    public get minUnitCostKoef(): number {
        return this._minUnitCostKoef;
    }

    public set minUnitCostKoef(value: number | undefined) {
        if (value) this._minUnitCostKoef = value;
    }

    public get playersCountDifficultyKoef(): number {
        return this._playersCountDifficultyKoef;
    }

    public set playersCountDifficultyKoef(value: number | undefined) {
        if (value) this._playersCountDifficultyKoef = value;
    }

    public get playersCount(): number {
        return this._playersCount;
    }

    public set playersCount(value: number | undefined) {
        if (value) this._playersCount = value;
    }

    public get playerCountDifficulty(): number {
        if (this.playersCount <= 1) return 1;
        let extraPlayers = this.playersCount - 1;
        let extraDifficulty = extraPlayers * this.playersCountDifficultyKoef;
        return 1 + extraDifficulty;
    }

    public GetWaveLvl(waveNumber: number) {
        return this.lvlDefault + (this.lvlKoef * waveNumber);
    }

    public GetMinUnitCost(waveNumber: number) {
        return this.minUnitCostDefault + (this.minUnitCostKoef * waveNumber);
    }

    public GetWaveCost(waveNumber: number) {
        return this.costDefault + (this.costKoef * waveNumber);
    }

}
