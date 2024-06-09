
export interface ISpawnPoint {
    
    Spawning(): boolean;

    Spawn(unit: string): void;
    SpawnAll(units: string[]): void;

    listenOnMobSpawned(action: Action<CDOTA_BaseNPC_Creature>): void;
}
