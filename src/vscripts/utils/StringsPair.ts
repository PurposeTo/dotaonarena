
export class StringsPair {

    public readonly key: string;
    public readonly value: string[];

    constructor(key: string, value: string[]) {
        this.key = key;
        this.value = value;
    }

    public AsObject(): any {
        const obj: any = {}
        obj[this.key] = this.value;
        return obj;
    }

    public Print() {
        DeepPrintTable(this.AsObject());
    }

    public static PrintArray(array: StringsPair[]) {
        array.forEach(it => {
            it.Print();
        })
    }
}
