import { KvReader } from "../../utils/KvReader";

export class WavesProperties {
    private static readonly PATH: string = "scripts/npc/spawn/waves/WavesProperties.txt";

    public readonly REST_TIME: number;
    public readonly MAX_ENEMIES: number;
    public readonly SPAWN_DELAY: number;

    public readonly LVL_DEFAULT: number;
    public readonly LVL_KOEF: number;

    public readonly COST_DEFAULT: number;
    public readonly COST_KOEF: number;

    public readonly MIN_UNIT_COST_DEFAULT: number;
    public readonly MIN_UNIT_COST_KOEF: number;

    public constructor(
        REST_TIME: number,
        MAX_ENEMIES: number,
        SPAWN_DELAY: number,
        LVL_DEFAULT: number,
        LVL_KOEF: number,
        COST_DEFAULT: number,
        COST_KOEF: number,
        MIN_UNIT_COST_DEFAULT: number,
        MIN_UNIT_COST_KOEF: number,
    ) {
        this.REST_TIME = REST_TIME;
        this.MAX_ENEMIES = MAX_ENEMIES;
        this.SPAWN_DELAY = SPAWN_DELAY;
        this.LVL_DEFAULT = LVL_DEFAULT;
        this.LVL_KOEF = LVL_KOEF;
        this.COST_DEFAULT = COST_DEFAULT;
        this.COST_KOEF = COST_KOEF;
        this.MIN_UNIT_COST_DEFAULT = MIN_UNIT_COST_DEFAULT;
        this.MIN_UNIT_COST_KOEF = MIN_UNIT_COST_KOEF;
    }

    public static Read(): WavesProperties {
        let map = KvReader.ReadAsMap(WavesProperties.PATH) as Map<string, number>;

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
        );
    }

    public GetWaveLvl(waveNumber: number) {
        return this.LVL_DEFAULT + (this.LVL_KOEF * waveNumber);
    }

    public GetMinUnitCost(waveNumber: number) {
        return this.MIN_UNIT_COST_DEFAULT + (this.MIN_UNIT_COST_KOEF * waveNumber);
    }

    public GetWaveCost(waveNumber: number) {
        return this.COST_DEFAULT + (this.COST_KOEF * waveNumber);
    }

}
