import { GlobalConstants } from "../GlobalConstants";
import { reloadable } from "../lib/tstl-utils";
import { ISpawnPoint } from "./ISpawnPoint";
import { Spawner } from "./Spawner";


@reloadable
export class SpawnPoint implements ISpawnPoint {

    private static readonly TEAM: DotaTeam = GlobalConstants.ENEMY_TEAM;
    private static readonly SPAWN_DELAY = 1;

    private readonly point: CBaseEntity;
    private readonly spawner: Spawner;

    private unitsQueue: string[] = [];

    private spawning: boolean = false;

    private onMobSpawned: Action<CDOTA_BaseNPC_Creature> = (unit) => { }

    constructor(point: CBaseEntity) {
        this.point = point;
        this.spawner = new Spawner();

    }

    public Spawning(): boolean {
        return this.spawning;
    }

    public IsEmptyQueue() {
        return this.unitsQueue.length == 0;
    }

    public listenOnMobSpawned(action: Action<CDOTA_BaseNPC_Creature>) {
        this.onMobSpawned = action;
    }

    public Spawn(unit: string) {
        this.unitsQueue.push(unit);

        this.SpawnFromQueue();
    }

    public SpawnAll(units: string[]) {
        this.unitsQueue.push(...units);

        this.SpawnFromQueue();
    }

    private SpawnFromQueue() {
        if (this.spawning) return;

        this.spawning = true;

        Timers.CreateTimer(() => {
            if (this.IsEmptyQueue()) {
                return;
            }

            const unitName: string = this.pollUnitToSpawn();
            const unit = this.spawner.CreateUnitByName(unitName, this.point, SpawnPoint.TEAM);
            this.onMobSpawned(unit);

            if (this.IsEmptyQueue()) {
                this.spawning = false;
            }

            return SpawnPoint.SPAWN_DELAY;
        });
    }

    private pollUnitToSpawn(): string {
        const unit = assert(this.unitsQueue.pop());
        return unit;
    }
}
