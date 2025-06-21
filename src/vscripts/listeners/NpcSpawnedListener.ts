
export class NpcSpawnedListener {

    private listeners: INpcSpawned[] = [];

    constructor() {
        ListenToGameEvent("npc_spawned", (event) => this.OnNpcSpawned(event), undefined);
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        this.listeners.forEach(listener => {
            listener(event);
        });
    }

    public listen(listener: INpcSpawned) {
        this.listeners.push(listener);
    }

    public clean() {
        this.listeners = [];
    }

}

export interface INpcSpawned extends Action<NpcSpawnedEvent> {

}
