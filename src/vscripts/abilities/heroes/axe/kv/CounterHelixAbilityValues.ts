
export class CounterHelixAbilityValues {
    private static readonly RADIUS = 'radius'
    private static readonly TRIGGER_ATTACKS = 'trigger_attacks'
    private static readonly DAMAGE_MULTIPLIER = "damage_multiplier"

    private readonly _ability

    private _radius: number = 0
    private _triggerAttacks: number = 0
    private _attackDamageMultiplier: number = 0

    constructor(ability: CDOTABaseAbility) {
        this._ability = ability
        this.Update()
    }

    public Update() {
        this._radius = this._ability.GetSpecialValueFor(CounterHelixAbilityValues.RADIUS)
        this._triggerAttacks = this._ability.GetSpecialValueFor(CounterHelixAbilityValues.TRIGGER_ATTACKS)
        this._attackDamageMultiplier = this._ability.GetSpecialValueFor(CounterHelixAbilityValues.DAMAGE_MULTIPLIER)
    }

    public radius() {
        return this._radius
    }

    public triggerAttacks() {
        return this._triggerAttacks
    }

    public damageMultiplier() {
        return this._attackDamageMultiplier
    }
}
