
export class ButtleHungerAbilityValues {
    private static readonly DURATION_NAME = "duration";
    private static readonly DAMAGE_REDUCTION_NAME = "damage_reduction";
    private static readonly BONUS_ATTACK_SPEED_NAME = "bonus_attack_speed";

    private readonly _ability;

    private _duration: number = 0;
    private _damageReduction: number = 0;
    private _bonusAttackSpeed: number = 0;
    
    constructor(ability: CDOTABaseAbility) {
        this._ability = ability
        this.Update();
    }

    public Update() {
        this._duration = this._ability.GetSpecialValueFor(ButtleHungerAbilityValues.DURATION_NAME)
        this._damageReduction = this._ability.GetSpecialValueFor(ButtleHungerAbilityValues.DAMAGE_REDUCTION_NAME)
        this._bonusAttackSpeed = this._ability.GetSpecialValueFor(ButtleHungerAbilityValues.BONUS_ATTACK_SPEED_NAME)
    }

    public duration() {
        return this._duration
    }

    public damageReduction() {
        return this._damageReduction
    }

    public bonusAttackSpeed() {
        return this._bonusAttackSpeed
    }
}