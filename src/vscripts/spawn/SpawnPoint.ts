import { GlobalConstants } from "../GlobalConstants";
import { reloadable } from "../lib/tstl-utils";
import { Spawner } from "./Spawner";


@reloadable
export class SpawnPoint {

    private static readonly TEAM: DotaTeam = GlobalConstants.ENEMY_TEAM;
    private static readonly SPAWN_DELAY = 1;

    private readonly name: string;
    private readonly point: CBaseEntity;
    private readonly spawner: Spawner;

    private unitsQueue: string[] = [];

    private spawning: boolean = false;
    private aliveMobs: CDOTA_BaseNPC_Creature[] = [];

    private onMobSpawned: Action<CDOTA_BaseNPC_Creature> = (unit) => { }
    private onAllMobsKilled: Runnable = () => { }

    constructor(name: string) {
        this.name = name;
        this.point = assert(Entities.FindByName(undefined, name));
        this.spawner = new Spawner();

        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);
    }

    public listenOnMobSpawned(action: Action<CDOTA_BaseNPC_Creature>) {
        this.onMobSpawned = action;
    }

    public listenOnAllMobsKilled(action: Runnable) {
        this.onAllMobsKilled = action;
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
            if (this.isEmptyQueue()) return;

            const unitName: string = this.getUnitToSpawn();
            const unit = this.spawner.CreateUnitByName(unitName, this.point, SpawnPoint.TEAM);
            this.aliveMobs.push(unit);
            this.onMobSpawned(unit);

            return SpawnPoint.SPAWN_DELAY;
        });
    }

    private OnEntityKilled(data: EntityKilledEvent): void {
        this.aliveMobs = this.aliveMobs.filter((e) => {
            return !e.IsNull() && e.IsAlive();
        });

        if (this.isNoAlive() && this.isEmptyQueue()) {
            this.onAllMobsKilled();
        }
    }

    private isEmptyQueue() {
        return this.unitsQueue.length == 0;
    }

    private isNoAlive() {
        return this.aliveMobs.length == 0;
    }

    private getUnitToSpawn(): string {
        const index = this.unitsQueue.length - 1;
        return this.unitsQueue[index];
    }
}
