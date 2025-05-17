import { reloadable } from "../lib/tstl-utils";
import { PlayerUtils } from '../utils/PlayerUtils';


@reloadable
// опыт получают одновременно все игроки в размере 1:1
export class SharePlayerExp {

    constructor() {
        const gameModEnt = GameRules.GetGameModeEntity();
        gameModEnt.SetModifyExperienceFilter((data) => this.ShareExp(data), this);
    }

    public ShareExp(data: ModifyExperienceFilterEvent) {
        const shareable: number[] = [
            ModifyXpReason.HERO_KILL,
            ModifyXpReason.CREEP_KILL,
            ModifyXpReason.ROSHAN_KILL,
            ModifyXpReason.TOME_OF_KNOWLEDGE,
            ModifyXpReason.OUTPOST
        ]

        if (!shareable.includes(data.reason_const)) {
            return true
        }

        let assistExp = data.experience;
        PlayerUtils.foreachPlayers(id => {
            const hero: CDOTA_BaseNPC_Hero = assert(PlayerResource.GetSelectedHeroEntity(id));
            hero.AddExperience(assistExp, ModifyXpReason.CATCH_UP, false, true);
        })

        return false;
    }
}