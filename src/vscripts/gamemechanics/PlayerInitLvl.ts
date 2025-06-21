import { NpcSpawnedListener } from "../listeners/NpcSpawnedListener";

export class PlayerInitLvl {

    private static readonly INIT_LVL: number = 3;

    private readonly npcSpawnedListener = new NpcSpawnedListener();

    constructor() {
        this.npcSpawnedListener.listen(event => this.setPlayerInitLvl(event));
    }

    private setPlayerInitLvl(event: NpcSpawnedEvent) {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        if (unit.IsRealHero()) {
            let lvl = unit.GetLevel();
            let diff = PlayerInitLvl.INIT_LVL - lvl;

            if (diff <= 0) return;

            for (let index = 0; index < diff; index++) {
                unit.HeroLevelUp(false);
            }
        }
    }
}
