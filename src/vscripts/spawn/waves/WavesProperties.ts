import { KvReader } from "../../utils/KvReader";

export class WavesProperties {
    private static readonly PATH: string = "scripts/npc/spawn/waves/WavesProperties.txt";

    private _restTime: number = 1;
    private _maxEnemies: number = 10;
    private _spawnDelay: number = 1;
    private _lvlDefault: number = 1;
    private _lvlKoef: number = 1;
    private _costDefault: number = 1;
    private _costKoef: number = 1;
    private _minUnitCostDefault: number = 0;
    private _minUnitCostKoef: number = 0;
    private _playerCountDifficulty: number = 1;

    public static Read(): WavesProperties {
        let map = KvReader.ReadAsMap(WavesProperties.PATH) as Map<string, number>;

        let out = new WavesProperties();
        out.restTime = map.get("REST_TIME")!;
        out.maxEnemies = map.get("MAX_ENEMIES")!;
        out.spawnDelay = map.get("SPAWN_DELAY")!;
        out.lvlDefault = map.get("LVL_DEFAULT")!;
        out.lvlKoef = map.get("LVL_KOEF")!;
        out.costDefault = map.get("COST_DEFAULT")!;
        out.costKoef = map.get("COST_KOEF")!;
        out.minUnitCostDefault = map.get("MIN_UNIT_COST_DEFAULT")!;
        out.minUnitCostKoef = map.get("MIN_UNIT_COST_KOEF")!;
        out._playerCountDifficulty = map.get("PLAYER_COUNT_DIFFICULTY")!;

        return out;
    }

    public get restTime(): number {
        return this._restTime;
    }

    public set restTime(value: number) {
        this._restTime = value;
    }

    public get maxEnemies(): number {
        return this._maxEnemies;
    }

    public set maxEnemies(value: number) {
        this._maxEnemies = value;
    }

    public get spawnDelay(): number {
        return this._spawnDelay;
    }

    public set spawnDelay(value: number) {
        this._spawnDelay = value;
    }

    public get lvlDefault(): number {
        return this._lvlDefault;
    }

    public set lvlDefault(value: number) {
        this._lvlDefault = value;
    }

    public get lvlKoef(): number {
        return this._lvlKoef * this._playerCountDifficulty;
    }

    public set lvlKoef(value: number) {
        this._lvlKoef = value;
    }

    public get costDefault(): number {
        return this._costDefault;
    }

    public set costDefault(value: number) {
        this._costDefault = value * this._playerCountDifficulty;
    }

    public get costKoef(): number {
        return this._costKoef * this._playerCountDifficulty;
    }

    public set costKoef(value: number) {
        this._costKoef = value;
    }

    public get minUnitCostDefault(): number {
        return this._minUnitCostDefault;
    }

    public set minUnitCostDefault(value: number) {
        this._minUnitCostDefault = value;
    }

    public get minUnitCostKoef(): number {
        return this._minUnitCostKoef;
    }

    public set minUnitCostKoef(value: number) {
        this._minUnitCostKoef = value;
    }

    public get playerCountDifficulty(): number {
        return this._playerCountDifficulty;
    }

    public set playerCountDifficulty(value: number) {
        this._playerCountDifficulty = value;
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
