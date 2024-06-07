import { reloadable } from "../lib/tstl-utils";


@reloadable
export class EntityKilledBounty {

    private static ASSIST_BOUNTY_MODIFIER = 0.8;
    private static PLAYER_CONT_BOUNTY_MODIFIER = 1.75;

    constructor() {
        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);
    }

    public OnEntityKilled(data: EntityKilledEvent): void {
        const killed_entity_index = data.entindex_killed;
        const attacker_entity_index = data.entindex_attacker;

        if (killed_entity_index == null || attacker_entity_index == null) {
            return;
        }

        const killedEnt: CBaseEntity = assert(EntIndexToHScript(killed_entity_index))
        const attackerEnt: CBaseEntity = assert(EntIndexToHScript(attacker_entity_index))
        if (killedEnt == attackerEnt) {
            return;
        }

        if (killedEnt.IsPlayer()) {
            return;
        }

        if (killedEnt.IsBaseNPC()) {
            const baseNpc = killedEnt as CDOTA_BaseNPC;

            if (!attackerEnt.IsBaseNPC) return;
            const attackerNpc = attackerEnt as CDOTA_BaseNPC;

            const attackerPlayerId = attackerNpc.GetPlayerOwnerID();
            if (!PlayerResource.IsValidPlayerID(attackerPlayerId)) return;

            this.OnMobKilledByPlayer(attackerPlayerId, baseNpc);
        }
    }

    private OnMobKilledByPlayer(attacker: PlayerID, killed: CDOTA_BaseNPC) {
        const gold = killed.GetGoldBounty();
        const exp = killed.GetDeathXP();
        this.AddPlayerBounty(attacker, gold, exp);
    }

    private AddPlayerBounty(attacker: PlayerID, gold: number, exp: number) {
        const playerCount = PlayerResource.GetPlayerCount();

        let assistGold = this.CalculateBounty(gold, playerCount);
        const assistExp = this.CalculateBounty(exp, playerCount);

        for (let i = 0; i < DOTA_MAX_TEAM_PLAYERS; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;

            if(i == attacker) {
                return; //only for other players
            }

            const hero: CDOTA_BaseNPC_Hero = assert(PlayerResource.GetSelectedHeroEntity(i));

            hero.ModifyGold(assistGold, true, ModifyGoldReason.SHARED_GOLD);
            hero.AddExperience(assistExp, ModifyXpReason.CATCH_UP, false, true);
        }
    }

    private Round(num: number, fractionDigits: number): number {
        return Number(num.toFixed(fractionDigits));
    }

    private CalculateBounty(bounty: number, playerCount: number): number {
        let max = bounty * EntityKilledBounty.ASSIST_BOUNTY_MODIFIER;
        max = math.max(max, 1);

        let newValue = bounty / playerCount;
        newValue = math.max(newValue, 1);

        newValue *= EntityKilledBounty.PLAYER_CONT_BOUNTY_MODIFIER;
        newValue = math.min(newValue, max);
        newValue = this.Round(newValue, 0);
        return newValue;
    }
}
