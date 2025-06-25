
export class KvReader {

    public static readAsMap(path: string) {
        const rawFile = LoadKeyValues(path) as any;
        return KvReader.formatKVToMap(rawFile);
    }

    public static formatKVToMap(rawKv: any) {
        if (rawKv) {
            let e = Object.entries(rawKv);
            return new Map(e);
        }
        else return new Map();
    }

    public static readProperties(path: string, pathDev: string): Map<string, any> {
        let map = KvReader.readAsMap(path) as Map<string, any>;

        if (IsInToolsMode()) {
            let toolsModeMap = KvReader.readAsMap(pathDev) as Map<string, any>;
            map = new Map([...map.entries(), ...toolsModeMap.entries()]);
        }

        return map;
    }
}
