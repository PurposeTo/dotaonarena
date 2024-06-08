import { MultiRecord } from "../spawn/MultiRecord";
import { DotaRandom } from "../utils/DotaRandom";

export class WaveConfig {
    private waves = this.LoadWaves();
    private groups = this.LoadGroups();

    public FindWaveGroups(waveIndex: number) {
        const waveName = "wave_" + waveIndex;

        const wave = this.waves.has(waveName)
            ? assert(this.waves.get(waveName))
            : DotaRandom.randomMapValue(this.waves);

        print("Found wave units: " + this.waves.has(waveName))
        DeepPrintTable(wave);

        return wave;
    }

    public FindGroupUnits(group: string) {
        return assert(this.groups.get(group));
    }

    private LoadWaves(): Map<string, string[]> {
        const rawFile = LoadKeyValues("scripts/npc/spawn/waves/waves.txt") as any;
        return this.ReadMultiRecordsFile(rawFile);
    }

    private LoadGroups(): Map<string, string[]> {
        const rawFile = LoadKeyValues("scripts/npc/spawn/groups/groups.txt") as any;
        return this.ReadMultiRecordsFile(rawFile);
    }

    private ReadMultiRecordsFile(rawFile: any): Map<string, string[]> {
        const out: Map<string, string[]> = new Map<string, string[]>();

        const keys: string[] = Object.keys(rawFile);
        keys.forEach((key: string) => {
            const value: any = rawFile[key] as any;
            const rawRecords = Object.values(value);

            const unitsRecords: MultiRecord[] = [];
            rawRecords.forEach((entry: any) => {
                const name: string = entry["name"];
                const count: number = entry["count"]
                const record = new MultiRecord(name, count);
                unitsRecords.push(record);
            });

            this.FlatRecords(unitsRecords);
            const flatUnits: string[] = this.FlatRecords(unitsRecords);

            out.set(key, flatUnits);
        })

        return out;
    }


    private FlatRecords(records: MultiRecord[]): string[] {
        const list: string[] = [];
        records.forEach((record: MultiRecord) => {
            const name = record.getName();
            const count = record.getCount();

            for (let i = 0; i < count; i++) {
                list.push(name);
            }
        });

        return list;
    }

}
