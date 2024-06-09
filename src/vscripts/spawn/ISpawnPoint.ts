
export interface ISpawnPoint {
    Spawn(unit: string): void;
    SpawnAll(units: string[]): void;

    listenOnMobSpawned(action: Action<CDOTA_BaseNPC_Creature>): void;
    listenOnAllMobsKilled(action: Runnable): void
}
