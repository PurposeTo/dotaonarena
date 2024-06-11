import { reloadable } from "../lib/tstl-utils";
import { PlayerUtils } from '../utils/PlayerUtils';


@reloadable
export class SharePlayerBounty {

    private static BALANCE_KOEF = 1.75;

    private playerCount = PlayerResource.GetPlayerCount();


    constructor() {
        const gameModEnt = GameRules.GetGameModeEntity();
        gameModEnt.SetModifyGoldFilter((data) => this.ShareGold(data), this);
        gameModEnt.SetModifyExperienceFilter((data) => this.ShareExp(data), this);
    }

    public ShareGold(data: ModifyGoldFilterEvent) {
        const shareable: number[] = [
            ModifyGoldReason.HERO_KILL,
            ModifyGoldReason.CREEP_KILL,
            ModifyGoldReason.NEUTRAL_KILL,
            ModifyGoldReason.ROSHAN_KILL,
            ModifyGoldReason.WARD_KILL,
            ModifyGoldReason.COURIER_KILL,
        ]

        if (!shareable.includes(data.reason_const)) {
            return true
        }

        let assistGold = this.CalculateBounty(data.gold);
        PlayerUtils.foreachPlayers(id => {
            const hero: CDOTA_BaseNPC_Hero = assert(PlayerResource.GetSelectedHeroEntity(id));
            hero.ModifyGold(assistGold, true, ModifyGoldReason.SHARED_GOLD);
        })


        return false;
    }

    public ShareExp(data: ModifyExperienceFilterEvent) {
        const shareable: number[] = [
            ModifyXpReason.HERO_KILL,
            ModifyXpReason.CREEP_KILL,
            ModifyXpReason.ROSHAN_KILL,
        ]

        if (!shareable.includes(data.reason_const)) {
            return true
        }

        let assistExp = this.CalculateBounty(data.experience);
        PlayerUtils.foreachPlayers(id => {
            const hero: CDOTA_BaseNPC_Hero = assert(PlayerResource.GetSelectedHeroEntity(id));
            hero.AddExperience(assistExp, ModifyXpReason.CATCH_UP, false, true);
        })

        return false;
    }

    private Round(num: number, fractionDigits: number): number {
        return Number(num.toFixed(fractionDigits));
    }

    private CalculateBounty(bounty: number): number {

        let max = bounty;
        max = math.max(max, 1);

        let newValue = bounty / this.playerCount;
        newValue = math.max(newValue, 1);

        newValue *= SharePlayerBounty.BALANCE_KOEF;
        newValue = math.min(newValue, max);
        newValue = this.Round(newValue, 0);
        return newValue;
    }
}
