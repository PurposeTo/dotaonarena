import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../../../lib/dota_ts_adapter';
import { ButtleHungerAbilityValues } from './kv/ButtleHungerAbilityValues';

@registerAbility()
class axe_battle_hunger_custom extends BaseAbility {
    GetIntrinsicModifierName(): string {
        return 'modifier_axe_battle_hunger_custom';
    }

}

@registerModifier()
class modifier_axe_battle_hunger_custom extends BaseModifier {
    private _ability = this.GetAbility()!;
    private _caster = this.GetCaster()!;
    private _abilityValues: ButtleHungerAbilityValues = new ButtleHungerAbilityValues(this._ability)

    IsHidden(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return true;
    }

    AllowIllusionDuplicate(): boolean {
        return true;
    }

    OnCreated(params: object): void {

    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK_LANDED];
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        let canApply = IsServer() &&
            event.target == this._caster &&
            !this._caster.PassivesDisabled() &&
            !event.attacker.IsBuilding() &&
            !event.attacker.IsWard();

        if (canApply) {
            let enemy = event.attacker
            enemy.AddNewModifier(this._caster, this._ability, 'modifier_axe_battle_hunger_debuff_custom', {
                duration: this._abilityValues.duration(),
            });
        }

        }
    }

@registerModifier()
class modifier_axe_battle_hunger_debuff_custom extends BaseModifier {
    private _ability = this.GetAbility()!;
    private _caster = this.GetCaster()!;
    private _parent = this.GetParent()!;
    private _abilityValues: ButtleHungerAbilityValues = new ButtleHungerAbilityValues(this._ability)


    private cachedDamage = 0
	private cachedAttackSpeed = 0

    IsHidden(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ATTACKSPEED_BONUS_CONSTANT, ModifierFunction.DAMAGEOUTGOING_PERCENTAGE];
    }

    OnCreated(params: object): void {
        this._abilityValues.Update();
        this.UpdateSpecialValues();
    }

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }

    GetModifierAttackSpeedBonus_Constant(): number {
		return this.cachedAttackSpeed;
	}

	GetModifierDamageOutgoing_Percentage(): number {
		return this.cachedDamage;
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this._abilityValues.damageReduction();
		this.cachedAttackSpeed = this._abilityValues.bonusAttackSpeed();
	}
}
