import { Process } from "../../utils/Process";
import { AliveUnitsContainer } from "../AliveUnitsContainer";
import { SpawnPoint } from "../SpawnPoint";
import { Troop } from "./Troop";

// спавнер отрядов крипов. Решает, в какой точке будут спавниться мобы, через какие промежутки.
export class TroopsSpawner {

    private readonly maxEnemies: number;
    private readonly spawnDelay: number;

    private readonly spawnPoint: SpawnPoint
    private readonly spawning: Process

    private readonly aliveMobs: AliveUnitsContainer = new AliveUnitsContainer()

    private toSpawn: Troop[] = [];

    private onUnitSpawned: Action<CDOTA_BaseNPC_Creature> = (unit) => { };
    private onAllUnitsKilled: Runnable = () => { }; // событие, когда все юниты убиты и больше некого спавнить

    constructor(spawnPoint: SpawnPoint, maxEnemies: number, spawnDelay: number) {
        this.spawnPoint = spawnPoint
        this.maxEnemies = maxEnemies;
        this.spawnDelay = spawnDelay;

        this.spawning = new Process(
            () => this.CanSpawn(),
            () => this.Spawn(),
            this.spawnDelay
        )

        this.spawnPoint.listenOnUnitSpawned(unit => this.OnUnitSpawned(unit));
        this.aliveMobs.listenOnAllMobsKilled(() => this.CheckForTroopsKilled());

        this.spawning.Run();
    }

    public listenOnAllMobsKilled(action: Runnable) {
        this.onAllUnitsKilled = action;
    }

    public listenOnUnitSpawned(action: Action<CDOTA_BaseNPC_Creature>) {
        this.onUnitSpawned = action;
    }

    public SpawnAll(troops: Troop[]) {
        this.toSpawn = this.toSpawn.concat(troops);
    }

    public HaveNotUnitsToSpawn(): boolean {
        return this.toSpawn.length == 0;
    }

    private Spawn() {
        if (this.toSpawn.length == 0) return;

        let troop = assert(this.toSpawn.pop());
        this.spawnPoint.SpawnAll(troop.GetUnits())
    }

    private CanSpawn(): boolean {
        if (this.toSpawn.length == 0) return false;

        let troop = this.GetLast(this.toSpawn);
        let aliveCount = this.aliveMobs.GetAliveCount();
        let tooMuchEnemies = aliveCount + troop.GetCount() > this.maxEnemies;
        if (tooMuchEnemies) {
            // todo вынести в DEBUG категорию логов
            //print("There is too much enemies on map. Waiting for killing")
        }
        return aliveCount > 0 && tooMuchEnemies;
    }

    private GetLast(items: any[]) {
        return assert(items[items.length - 1]);
    }

    private OnUnitSpawned(unit: CDOTA_BaseNPC_Creature) {
        this.aliveMobs.push(unit);
        this.onUnitSpawned(unit);
    }

    private CheckForTroopsKilled() {
        if (this.HaveNotUnitsToSpawn()) {
            this.onAllUnitsKilled();
        }
    }
}
