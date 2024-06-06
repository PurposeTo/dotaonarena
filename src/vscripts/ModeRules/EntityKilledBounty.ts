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
        this.AddPlayerGold(attacker, gold);
    }

    private AddPlayerGold(attacker: PlayerID, gold: number) {
        const playerCount = PlayerResource.GetPlayerCount();

        let maxGold = gold * EntityKilledBounty.ASSIST_BOUNTY_MODIFIER;
        maxGold = math.max(maxGold, 1);

        let newGold = gold / playerCount;
        newGold = math.max(newGold, 1);

        newGold *= EntityKilledBounty.PLAYER_CONT_BOUNTY_MODIFIER;
        newGold = math.min(newGold, maxGold);
        newGold = this.Round(newGold, 0);
        print("add " + newGold + " gold for assist to each other players")

        for (let i = 0; i < DOTA_MAX_TEAM_PLAYERS; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;

            if(i == attacker) {
                const hero: CDOTA_BaseNPC_Hero = assert(PlayerResource.GetSelectedHeroEntity(i));
                const heroName = hero.GetName();
                print("Skip for attacker. Player hero: " + heroName);
                return; //only for other players

            }
            
            const hero: CDOTA_BaseNPC_Hero = assert(PlayerResource.GetSelectedHeroEntity(i));

            hero.ModifyGold(newGold, true, ModifyGoldReason.SHARED_GOLD);
        }
    }

    private Round(num: number, fractionDigits: number): number {
        return Number(num.toFixed(fractionDigits));
    }
}
