import { reloadable } from "../lib/tstl-utils";

@reloadable
export class EntityKilledListener {

    constructor() {
        ListenToGameEvent("entity_killed", (data) => this.OnEntityKilled(data), undefined);
    }

    private OnEntityKilled(data: EntityKilledEvent): void {
        const unit = EntIndexToHScript(data.entindex_killed)!;
        const name = unit.GetName();
        const teamNumber = unit.GetTeamNumber();
        const teamName = DotaTeamText[teamNumber];
        print("killed: " + name + " on team: " + teamName);
    }
}

enum DotaTeamText {
    GOODGUYS = 2,
    BADGUYS = 3,
    NEUTRALS = 4,
    NOTEAM = 5,
    CUSTOM_1 = 6,
    CUSTOM_2 = 7,
    CUSTOM_3 = 8,
    CUSTOM_4 = 9,
    CUSTOM_5 = 10,
    CUSTOM_6 = 11,
    CUSTOM_7 = 12,
    CUSTOM_8 = 13,
    DRAFT_POOL = 14,
}
