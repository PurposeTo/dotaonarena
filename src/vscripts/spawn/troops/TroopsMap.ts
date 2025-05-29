import { TroopDto } from "./dto/TroopDto";
import { UnitsDto } from "./dto/UnitsDto";

export class TroopsMap {

    private troops = new Map<string, TroopDto>();

    public Set(troop: TroopDto) {
        this.troops.set(troop.GetName(), troop);
    }

    public Get(name: string): TroopDto {
        if(!this.troops.has(name)) {
            print("ERROR. Units group '" + name + "' is not presented")
        }

        return this.troops.get(name)!;
    }


    public static Instance() {
        let troopDto = new TroopDto("kobold_troop", 1, [new UnitsDto("npc_dota_neutral_kobold_taskmaster", 1), new UnitsDto("npc_dota_neutral_kobold_tunneler", 1), new UnitsDto("npc_dota_neutral_kobold", 3)]);
        let troopsMap = new TroopsMap();
        troopsMap.Set(troopDto);

        return troopsMap;
    }

}
