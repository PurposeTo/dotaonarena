
export class CullingBladeAbilityValues {
    private static readonly DAMAGE_MULTIPLIER = "damage_multiplier"

    private readonly _ability

    private _damageMultiplier: number = 0

    constructor(ability: CDOTABaseAbility) {
        this._ability = ability
        this.Update()
    }

    public Update() {
        this._damageMultiplier = this._ability.GetSpecialValueFor(CullingBladeAbilityValues.DAMAGE_MULTIPLIER)
    }


    public damageMultiplier() {
        return this._damageMultiplier
    }
}
