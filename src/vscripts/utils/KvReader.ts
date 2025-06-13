
export class KvReader {

    public static ReadAsMap(path: string) {
        const rawFile = LoadKeyValues(path) as any;
        return KvReader.FormatKVToMap(rawFile);
    }


    public static FormatKVToMap(rawKv: any) {
        let e = Object.entries(rawKv);
        return new Map(e);
    }
}