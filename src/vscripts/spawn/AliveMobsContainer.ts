
export class AliveMobsContainer {
    private aliveMobs: CDOTA_BaseNPC_Creature[] = [];

    private onAllMobsKilled: Runnable = () => { }

    constructor() {
        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);
    }

    public push(unit: CDOTA_BaseNPC_Creature) {
        this.aliveMobs.push(unit);
    }

    public listenOnAllMobsKilled(action: Runnable) {
        this.onAllMobsKilled = action;
    }

    private OnEntityKilled(data: EntityKilledEvent): void {
        this.aliveMobs = this.aliveMobs.filter((e) => {
            return !e.IsNull() && e.IsAlive();
        });

        if (this.noAlive()) {
            this.onAllMobsKilled();
        }
    }

    private noAlive() {
        return this.aliveMobs.length == 0;
    }
}