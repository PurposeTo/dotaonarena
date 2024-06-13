import { ArrayStringPair } from "../utils/ArrayStringPair";

export class WaveConfig {
    private waves = this.LoadWaves();
    private groups = this.LoadGroups();

    public FindWaveGroups(waveIndex: number) {
        const waveName = "wave_" + waveIndex;

        print("Found wave units: " + this.waves.Contains(waveName))

        const wave: string[] = this.waves.Contains(waveName)
            ? this.waves.FindAny(waveName)
            : this.waves.Random();

        
        DeepPrintTable(wave);

        return wave;
    }

    public FindGroupUnits(group: string) {
        if (!this.groups.Contains(group)) {
            print("ERROR. Units group '" + group + "' is not presented")
        }

        return this.groups.FindAny(group);
    }

    private LoadWaves() {
        const rawFile = LoadKeyValues("scripts/npc/spawn/waves/waves.txt") as any;
        return ArrayStringPair.read(rawFile);
    }

    private LoadGroups() {
        const rawFile = LoadKeyValues("scripts/npc/spawn/groups/groups.txt") as any;
        return ArrayStringPair.read(rawFile);
    }

}
