import { MultiRecord } from "../spawn/MultiRecord";

export class WaveConfig {

    public FindWaveMobs() {
        const waves = this.LoadWaves();
        const groups = this.LoadGroups();

        const waveIndex = 1;
        const waveName = "wave_" + waveIndex;

        const waveGroups = waves.get(waveName)!;

        DeepPrintTable(waveGroups)
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
