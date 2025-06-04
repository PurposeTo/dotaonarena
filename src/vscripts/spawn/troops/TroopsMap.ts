import { TroopDto } from "./dto/TroopDto";

export class TroopsMap {

    private troops = new Map<string, TroopDto>();

    public SetAll(troops: TroopDto[]) {
        troops.forEach(troop => {
            this.Set(troop);
        });
    }

    public Set(troop: TroopDto) {
        this.troops.set(troop.GetName(), troop);
    }

    public Get(name: string): TroopDto {
        if (!this.troops.has(name)) {
            print("ERROR. Troop '" + name + "' is not presented")
        }

        return this.troops.get(name)!;
    }
}
