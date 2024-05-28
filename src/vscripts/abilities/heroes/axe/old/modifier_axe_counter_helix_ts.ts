import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter";
import { CounterHelixAbilityValues } from "../kv/CounterHelixAbilityValues";

@registerAbility()
export class CounterHelix extends BaseAbility {

    private readonly kv: CounterHelixAbilityValues;

    constructor() {
        super();
        this.kv = new CounterHelixAbilityValues(this);
    }

    GetIntrinsicModifierName(): string {
        return 'modifier_axe_counter_helix_ts';
    }

    OnUpgrade(): void {
        this.setStackCount();
    }

    OnOwnerSpawned(): void {
        this.setStackCount();
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        const caster = this.GetCaster();
        const rangeBonus = caster.GetCastRangeBonus();
        const radius = this.kv.radius();
        return radius - rangeBonus;
    }

    private setStackCount() {
        const modifier = this.GetModifier();
        const triggerAttacks = this.kv.triggerAttacks();

        modifier.SetStackCount(triggerAttacks);
    }

    private GetModifier(): CDOTA_Buff {
        const caster = this.GetCaster();
        const name = this.GetIntrinsicModifierName();
        return caster.FindModifierByName(name)!;
    }

}