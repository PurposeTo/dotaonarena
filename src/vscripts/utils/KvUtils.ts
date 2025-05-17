import { reloadable } from "../lib/tstl-utils";

@reloadable
export class KvUtils {
    private static readonly EMIT_SOUND_KEY = "AbilitySound";

    public static GetEmitSoundName(ability: CDOTABaseAbility) {
        const kv = ability.GetAbilityKeyValues();
        const soundName = Object.entries(kv).find(([key, val]) => key == this.EMIT_SOUND_KEY)?.[1];
        return soundName;
    }
}
