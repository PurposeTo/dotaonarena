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
        return this.abilityValues.radius() - this.castRangeBonus();
    }

    private castRangeBonus() {
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

    private readonly DEBUFF_NAME = 'modifier_axe_counter_helix_debuff_ts';
    private readonly PARTICLE_ATTACHMENT = 'attach_attack1';
    private readonly PARTICLES = 'particles/units/heroes/hero_axe/axe_counterhelix.vpcf';
    private readonly EMIT_SOUND_KEY: string = 'AbilitySound';

    private suppressCleave: 0 | 1 = 0;

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
        return [
            ModifierFunction.ON_ATTACK_LANDED,
            ModifierFunction.PROCATTACK_FEEDBACK,
            ModifierFunction.SUPPRESS_CLEAVE,
        ];
    }

    private ResetStackCount() {
        const triggerAttacks = this.abilityValues.triggerAttacks();
        this.SetStackCount(triggerAttacks);
    }

    GetSuppressCleave(event: ModifierAttackEvent): 0 | 1 {
        print("Выключить сплеш: " + (this.suppressCleave == 1))
        return this.suppressCleave;
    }

    // запретить каст, если анимация еще идет
    GetModifierProcAttack_Feedback(event: ModifierAttackEvent): number {
        if (this.CanAttackFeedbackProc(event)) {
            this.CastAbility();
        }

        return 0;
    }


    // запретить каст, если анимация еще идет
    OnAttackLanded(event: ModifierAttackEvent): void {
        if (this.CanAttackLandedProc(event)) {
            this.CastAbility();
        }
    }

    private CastAbility() {
        this._ability.UseResources(false, false, false, true);
        this.DecreaseStackCount();

        if (this.GetStackCount() <= 0) {
            this.ResetStackCount();

            this.CreateVisualSoundEffect();

            const enemies = this.FindEnemies();
            this.HitEnemies(enemies);
        }
    }

    private DecreaseStackCount() {
        const stackCount = this.GetStackCount() - 1;
        this.SetStackCount(stackCount);
    }

    private CanAttackFeedbackProc(event: ModifierAttackEvent) {
        return IsServer() &&
            event.target != this._caster &&
            !this._caster.PassivesDisabled() &&
            !event.target.IsBuilding() &&
            !event.target.IsWard() &&
            this._ability.IsCooldownReady();
    }

    private CanAttackLandedProc(event: ModifierAttackEvent) {
        return IsServer() &&
            event.target == this._caster &&
            !this._caster.PassivesDisabled() &&
            !event.attacker.IsBuilding() &&
            !event.attacker.IsWard() &&
            this._ability.IsCooldownReady();
    }

    private CreateVisualSoundEffect() {
        const kv = this._ability.GetAbilityKeyValues();
        const soundName = Object.entries(kv).find(([key, val]) => key == this.EMIT_SOUND_KEY)?.[1];
        this._caster.EmitSound(soundName);
        this._caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_3);
        this.CreateParticles();
    }

    private CreateParticles() {
        const pfx = ParticleManager.CreateParticle(
            this.PARTICLES,
            ParticleAttachment.ABSORIGIN_FOLLOW,
            this._caster
        );
        ParticleManager.SetParticleControlEnt(
            pfx,
            0,
            this._caster,
            ParticleAttachment.POINT_FOLLOW,
            this.PARTICLE_ATTACHMENT,
            this._caster.GetAbsOrigin(),
            true
        );
        ParticleManager.ReleaseParticleIndex(pfx);
    }

    private FindEnemies() {
        return FindUnitsInRadius(
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
    }

    private HitEnemies(enemies: CDOTA_BaseNPC[]) {
        this._caster.AddNewModifier(this._caster, this._ability, "axe_counter_helix_outgoing_damage", {})
        for (const enemy of enemies) {
            this.HitEnemy(enemy);
        }
        this._caster.RemoveModifierByNameAndCaster("axe_counter_helix_outgoing_damage", this._caster)
    }

    private HitEnemy(enemy: CDOTA_BaseNPC) {
        const attackDamage = this._caster.GetAttackDamage();
        const damagePercent = this.abilityValues.damage();
        const damage = attackDamage * damagePercent / 100;

        this.ApplyAttack(enemy, this.abilityValues.procChanse());
        if (this.HasShard()) {
            this.AddCounterHelixDebugg(enemy);
        }
    }

    private AddCounterHelixDebugg(enemy: CDOTA_BaseNPC) {
        enemy.AddNewModifier(this._caster, this._ability, this.DEBUFF_NAME,
            {
                duration: this.abilityValues.shardDebuffDuration()
            }
        );
    }

    // change: from 1 to 100
    private ApplyAttack(enemy: CDOTA_BaseNPC, procChance: number) {
        const proc = RollPercentage(procChance)

        if (proc) {
            this.suppressCleave = 1;
            this._caster.PerformAttack(enemy, false, false, true, true, true, false, false);
        }
        else {
            this.suppressCleave = 0;
            this._caster.PerformAttack(enemy, false, true, true, true, true, false, false);
        }

        this.suppressCleave = 0;
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

@registerModifier()
class axe_counter_helix_outgoing_damage extends BaseModifier {
    private _ability = this.GetAbility()!;
    private abilityValues: CounterHelixAbilityValues = new CounterHelixAbilityValues(this._ability)

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
        this.abilityValues.Update();
    }

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.DAMAGEOUTGOING_PERCENTAGE,
        ];
    }

    GetModifierDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        return this.abilityValues.outgoingDamage();
    }

}
