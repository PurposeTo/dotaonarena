import { reloadable } from "../lib/tstl-utils";

@reloadable
export class PlayerUtils {

    public static foreachPlayers(action: Action<PlayerID>) {

        for (let i = 0; i < DOTA_MAX_TEAM_PLAYERS; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;

            action(i);
        }
    }
}
