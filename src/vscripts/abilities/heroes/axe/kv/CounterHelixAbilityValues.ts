
export class CounterHelixAbilityValues {
    private static readonly MODIFIER_NAME = 'modifier_axe_counter_helix_ts'
    private static readonly RADIUS = 'radius'
    private static readonly TRIGGER_ATTACKS = 'trigger_attacks'
    private static readonly DAMAGE = 'damage'

    private static readonly SHARD_MAX_STACKS = 'shard_max_stacks'
    private static readonly SHARD_DAMAGE_REDUCTION = 'shard_damage_reduction'
    private static readonly SHARD_DEBUFF_DURATION = 'shard_debuff_duration'
    private static readonly PROC_CHANCE = 'proc_chance'
    private static readonly OUTGOING_DAMAGE = 'damage_modifier'

    private readonly ability

    private _radius: number
    private _triggerAttacks: number
    private _shardMaxStacks: number
    private _shardDamageReduce: number
    private _damage: number
    private _shardDebuffDuration: number
    private _procChance: number
    private _outgoingDamage: number

    constructor(ability: CDOTABaseAbility) {
        this.ability = ability

        this._radius = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.RADIUS)
        this._triggerAttacks = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.TRIGGER_ATTACKS)
        this._shardMaxStacks = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.SHARD_MAX_STACKS)
        this._shardDamageReduce = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.SHARD_DAMAGE_REDUCTION)
        this._damage = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.DAMAGE)
        this._shardDebuffDuration = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.SHARD_DEBUFF_DURATION)
        this._procChance = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.PROC_CHANCE)
        this._outgoingDamage = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.OUTGOING_DAMAGE)
    }

    public Update() {
        this._radius = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.RADIUS)
        this._triggerAttacks = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.TRIGGER_ATTACKS)
        this._shardMaxStacks = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.SHARD_MAX_STACKS)
        this._shardDamageReduce = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.SHARD_DAMAGE_REDUCTION)
        this._damage = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.DAMAGE)
        this._shardDebuffDuration = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.SHARD_DEBUFF_DURATION)
        this._procChance = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.PROC_CHANCE)
        this._outgoingDamage = this.ability.GetSpecialValueFor(CounterHelixAbilityValues.OUTGOING_DAMAGE)
    }

    public radius() {
        return this._radius
    }

    public triggerAttacks() {
        return this._triggerAttacks
    }

    public shardMaxStacks() {
        return this._shardMaxStacks
    }

    public shardDamageReduction() {
        return this._shardDamageReduce
    }

    public damage() {
        return this._damage
    }

    public shardDebuffDuration() {
        return this._shardDebuffDuration
    }

    public procChanse() {
        return this._procChance
    }

    public outgoingDamage() {
        return this._outgoingDamage;
    }
}
