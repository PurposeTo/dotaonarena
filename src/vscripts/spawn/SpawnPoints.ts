import { reloadable } from "../lib/tstl-utils";
import { DotaRandom } from "../utils/DotaRandom";
import { ISpawnPoint } from "./ISpawnPoint";
import { SpawnPoint } from "./SpawnPoint";

@reloadable
export class SpawnPoints implements ISpawnPoint {

    private spawnPoints: ISpawnPoint[] = [];

    private onMobSpawned: Action<CDOTA_BaseNPC_Creature> = (unit) => { }
    private onAllMobsKilled: Runnable = () => { }

    constructor(names: string[]) {

        names.forEach(name => {
            const point: CBaseEntity = this.FindSpawnPoint(name);
            const spawnPoint = new SpawnPoint(point);
            spawnPoint.listenOnMobSpawned((u) => this.onMobSpawned(u));
            // todo on all mobs killed...

            this.spawnPoints.push(spawnPoint);
        });
    }

    public static fromConfig(): SpawnPoints {
        const rawFile = LoadKeyValues("scripts/npc/spawn/spawn_points.txt") as any;
        const array: any = rawFile["array"]
        const values: string[] = Object.values(array);

        return new SpawnPoints(values);
    }

    public listenOnMobSpawned(action: Action<CDOTA_BaseNPC_Creature>) {
        this.onMobSpawned = action;
    }

    public listenOnAllMobsKilled(action: Runnable) {
        this.onAllMobsKilled = action;
    }

    public Spawn(unit: string): void {
        const point = DotaRandom.randomArrayValue(this.spawnPoints);
        point.Spawn(unit);
    }

    public SpawnAll(units: string[]): void {
        const point = DotaRandom.randomArrayValue(this.spawnPoints);
        point.SpawnAll(units);
    }

    private FindSpawnPoint(name: string) {
        const nullablePoint = Entities.FindByName(undefined, name);
        if (nullablePoint == null) {
            print("ERROR. There is no spawn point with name '" + name + "'")
        }
        const point: CBaseEntity = assert(nullablePoint);
        return point;
    }
}
