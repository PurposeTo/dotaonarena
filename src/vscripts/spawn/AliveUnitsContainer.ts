
export class AliveUnitsContainer {
    private aliveUnits: CDOTA_BaseNPC_Creature[] = [];

    private onAllUnitsKilled: Runnable = () => { }

    constructor() {
        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);
    }

    public push(unit: CDOTA_BaseNPC_Creature) {
        this.aliveUnits.push(unit);
    }

    public listenOnAllMobsKilled(action: Runnable) {
        this.onAllUnitsKilled = action;
    }

    public GetAliveCount() {
        return this.aliveUnits.length;
    }

    private OnEntityKilled(data: EntityKilledEvent): void {
        this.aliveUnits = this.aliveUnits.filter((e) => {
            return !e.IsNull() && e.IsAlive();
        });

        if (this.noAlive()) {
            print("All units killed");
            this.onAllUnitsKilled();
        }
    }

    private noAlive() {
        return this.GetAliveCount() == 0;
    }
}