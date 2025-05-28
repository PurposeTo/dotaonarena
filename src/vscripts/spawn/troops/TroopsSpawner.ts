import { Process } from "../../utils/Process";
import { AliveMobsContainer } from "../AliveMobsContainer";
import { SpawnPoint } from "../SpawnPoint";
import { Troop } from "./Troop";

// спавнер отрядов крипов. Решает, в какой точке будут спавниться мобы, через какие промежутки.
export class TroopsSpawner {

    private static readonly MAX_ENEMIES = 60
    private static readonly SPAWN_DELAY = 10

    private readonly _spawnPoint: SpawnPoint
    private readonly _spawning: Process

    private readonly _aliveMobs: AliveMobsContainer = new AliveMobsContainer()

    private _aliveEnemies = 0 // todo значение должно меняться

    constructor(spawnPoint: SpawnPoint) {
        this._spawnPoint = spawnPoint

        // todo отряды должен определять wave 
        let troop = new Troop(1, ["npc_dota_neutral_giant_wolf", "npc_dota_neutral_giant_wolf", "npc_dota_neutral_giant_wolf", "npc_dota_neutral_giant_wolf", "npc_dota_neutral_giant_wolf"])
        this._spawning = new Process(
            () => this.CanSpawn(troop),
            () => this.Spawn(troop), 
            TroopsSpawner.SPAWN_DELAY
        )

        this._spawnPoint.listenOnMobSpawned(unit => this._aliveMobs.push(unit));
        this._aliveMobs.listenOnAllMobsKilled(() => this._aliveEnemies = 0)

        this._spawning.Run();
    }

    public SpawnAll(troops: Troop[]) {
        
    }

    public Spawn(troop: Troop) {
        this._aliveEnemies = troop.GetCount()
        this._spawnPoint.SpawnAll(troop.GetUnits())
    }


    public CanSpawn(troop: Troop): boolean {
        return this._aliveEnemies > 0 && this._aliveEnemies + troop.GetCount() > TroopsSpawner.MAX_ENEMIES
    }
}
