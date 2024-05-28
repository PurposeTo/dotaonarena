import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { CounterHelixAbilityValues } from "../kv/CounterHelixAbilityValues";

@registerModifier()
export class modifier_axe_counter_helix_debuff_ts extends BaseModifier {
    
    private _ability = this.GetAbility()!;
    private _caster = this.GetCaster()!;
    private _parent = this.GetParent()!;

    private readonly kv: CounterHelixAbilityValues;

    constructor() {
        super();
        this.kv = new CounterHelixAbilityValues(this._ability);
    }

    IsHidden(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.DAMAGEOUTGOING_PERCENTAGE];
    }

    GetModifierDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        if (event.target == this._caster && event.attacker == this._parent && !event.inflictor) {
            const shardDamageReduction = this.kv.shardDamageReduction();
            const stackCount = this.GetStackCount();
            return 0 - stackCount * shardDamageReduction;
        }
        return 0;
    }

    OnCreated(params: object): void {
        if (IsServer()) {
            const shardMaxStacks = this.kv.shardMaxStacks();
            const stackCount = this.GetStackCount();

            this.SetStackCount(math.min(stackCount + 1, shardMaxStacks));
        }
    }

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }
}
