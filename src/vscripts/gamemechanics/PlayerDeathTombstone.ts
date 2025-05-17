import { reloadable } from "../lib/tstl-utils";

@reloadable
// на месте смерти игрока появляется надгробие. Кликнув на него, игрока можно возродить
export class PlayerDeathTombstone {

    constructor() {
        ListenToGameEvent("dota_player_killed", (data) => this.OnPlayerKilled(data), undefined);

    }

    private OnPlayerKilled(event: DotaPlayerKilledEvent): void {
        const playerId = event.PlayerID;
        const player: CDOTAPlayerController = PlayerResource.GetPlayer(playerId)!;
        const playerHero: CDOTA_BaseNPC_Hero = player.GetAssignedHero();

        if (!playerHero.IsRealHero()) {
            return;
        }

        const newItem = CreateItem("item_tombstone", player, playerHero)!;
        newItem.SetPurchaseTime(0);
        newItem.SetPurchaser(playerHero);
        const tombstone = SpawnEntityFromTableSynchronous("dota_item_tombstone_drop", {}) as CDOTA_Item_Physical;
        const tombstoneEnt: CBaseEntity = tombstone;
        
        tombstone.SetContainedItem(newItem);
        tombstone.SetAngles(0, RandomFloat(0, 360), 0);
        FindClearSpaceForUnit(tombstoneEnt as CDOTA_BaseNPC, playerHero.GetAbsOrigin(), true);
    }

}
