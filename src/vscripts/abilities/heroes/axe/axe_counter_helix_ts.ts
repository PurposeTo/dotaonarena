import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../../../lib/dota_ts_adapter';
import { CounterHelixAbilityValues } from './kv/CounterHelixAbilityValues';

@registerAbility()
class axe_counter_helix_ts extends BaseAbility {
    private abilityValues: CounterHelixAbilityValues = new CounterHelixAbilityValues(this)

    GetIntrinsicModifierName(): string {
        return 'modifier_axe_counter_helix_ts';
    }

    OnUpgrade(): void {
        this.abilityValues.Update();
        this.ResetStackCount();
    }

    OnOwnerSpawned(): void {
        this.abilityValues.Update();
        this.ResetStackCount();
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.abilityValues.radius() - this.GetCastRangeBonus();
    }

    private GetCastRangeBonus() {
        return this.GetCaster().GetCastRangeBonus();
    }

    private ResetStackCount() {
        const modifierNAme = this.GetIntrinsicModifierName();
        const modifier: CDOTA_Buff = this.GetCaster().FindModifierByName(modifierNAme)!;
        const triggerAttacks = this.abilityValues.triggerAttacks();

        modifier.SetStackCount(triggerAttacks);
    }
}

@registerModifier()
class modifier_axe_counter_helix_ts extends BaseModifier {
    private _ability = this.GetAbility()!;
    private _caster = this.GetCaster()!;
    private _parent = this.GetParent()!;
    private abilityValues: CounterHelixAbilityValues = new CounterHelixAbilityValues(this._ability)

    IsHidden(): boolean {
        return false;
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
        this.abilityValues.Update();

        if (IsServer()) {
            const triggerAttacks = this.abilityValues.triggerAttacks();
            this.SetStackCount(triggerAttacks);
        }
    }

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK_LANDED];
    }

    private ResetStackCount() {
        const triggerAttacks = this.abilityValues.triggerAttacks();
        this.SetStackCount(triggerAttacks);
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (
            IsServer() &&
            event.target == this._caster &&
            !this._caster.PassivesDisabled() &&
            !event.attacker.IsBuilding() &&
            !event.attacker.IsWard() &&
            this._ability.IsCooldownReady()
        ) {
            this._ability.UseResources(false, false, false, true);
            const stackCount = this.GetStackCount() - 1;
            this.SetStackCount(stackCount);
            if (this.GetStackCount() <= 0) {
                this.ResetStackCount();
                this._caster.EmitSound('Hero_Axe.CounterHelix');

                this._caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_3);
                const pfx = ParticleManager.CreateParticle(
                    'particles/units/heroes/hero_axe/axe_counterhelix.vpcf',
                    ParticleAttachment.ABSORIGIN_FOLLOW,
                    this._caster
                );
                ParticleManager.SetParticleControlEnt(
                    pfx,
                    0,
                    this._caster,
                    ParticleAttachment.POINT_FOLLOW,
                    'attach_attack1',
                    this._caster.GetAbsOrigin(),
                    true
                );
                ParticleManager.ReleaseParticleIndex(pfx);

                const enemies = FindUnitsInRadius(
                    this._caster.GetTeamNumber(),
                    this._caster.GetAbsOrigin(),
                    undefined,
                    this.abilityValues.radius(),
                    UnitTargetTeam.ENEMY,
                    UnitTargetType.HERO + UnitTargetType.BASIC,
                    UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
                    FindOrder.ANY,
                    true
                );
                for (const enemy of enemies) {
                    const attackDamage = this._caster.GetAttackDamage();
                    const damagePercent = this.abilityValues.damage();
                    const damage = attackDamage * damagePercent / 100;

                    this.applyAttack(enemy, this.abilityValues.procChanse());
                    if (this.HasShard()) {
                        enemy.AddNewModifier(this._caster, this._ability, 'modifier_axe_counter_helix_debuff_ts', {
                            duration:  this.abilityValues.shardDebuffDuration(),
                        });
                    }
                }
            }
        }
    }

    private applyAttackWithProc(enemy: CDOTA_BaseNPC) {
        this._caster.PerformAttack(enemy, false, true, true, true, true, false, false);
    }

    private applyAttackWOProc(enemy: CDOTA_BaseNPC) {
        this._caster.PerformAttack(enemy, false, false, true, true, true, false, false);
    }

    // change: from 1 to 100
    private applyAttack(enemy: CDOTA_BaseNPC, procChance: number) {
        const noProc = RollPseudoRandomPercentage(procChance, PseudoRandom.CUSTOM_GAME_1, this._parent)
        this._caster.PerformAttack(enemy, false, !noProc, true, true, true, false, false);
    }

    private HasShard() {
        return this.GetModifierShard && this.GetModifierShard() == 1;
    }
}

@registerModifier()
class modifier_axe_counter_helix_debuff_ts extends BaseModifier {
    private _ability = this.GetAbility()!;
    private _caster = this.GetCaster()!;
    private _parent = this.GetParent()!;
    private _abilityValues: CounterHelixAbilityValues = new CounterHelixAbilityValues(this._ability)

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
            return 0 - this.GetStackCount() * this._abilityValues.shardDamageReduction();
        }
        return 0;
    }

    OnCreated(params: object): void {
        this._abilityValues.Update();

        if (IsServer()) {
            const currentStacksIncreased = this.GetStackCount() + 1;
            const maxStacks = this._abilityValues.shardMaxStacks();
            const stacks = math.min(currentStacksIncreased, maxStacks);
            this.SetStackCount(stacks);
        }
    }

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }
}