import { MultiRecord } from "../spawn/MultiRecord";
import { DotaRandom } from "./DotaRandom";
import { StringsPair } from "./StringsPair";


export class ArrayStringPair {
    public static INDEX_DELIMITER = "#"

    private readonly items: StringsPair[] = [];

    public static read(rawFile: any): ArrayStringPair {

        const out: ArrayStringPair = new ArrayStringPair();

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

            const pair = new StringsPair(key, flatUnits);
            out.Push(pair);
        })

        return out;

    }

    public Push(item: StringsPair) {
        this.items.push(item);
    }

    public Contains(key: string) {
        return this.items.some(it => {
            return this.compareKeys(it, key);
        })
    }

    public Get(key: string): StringsPair[] {
        const out: StringsPair[] = this.items.filter(it => {
            return this.compareKeys(it, key);
        })

        if (out.length == 0) {
            print("ERROR. Config value with key '" + key + "' is not presented")
        }

        return out;
    }

    private compareKeys(it: StringsPair, key: string) {
        const eq = it.key == key;
        const startWith = it.key.startsWith(key + ArrayStringPair.INDEX_DELIMITER);
        const correct = eq || startWith;

        return correct;
    }

    public FindAny(key: string): string[] {
        const find = this.Get(key);
        const random = DotaRandom.randomArrayValue(find);

        return random.value;
    }

    public Random(): string[] {
        const random = DotaRandom.randomArrayValue(this.items);
        return random.value;
    }

    private static FlatRecords(records: MultiRecord[]): string[] {
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

    public Print() {
        this.items.forEach(it => {
            it.Print();
        })
    }

}
