import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../../../lib/dota_ts_adapter';
import { KvUtils } from '../../../utils/KvUtils';
import { CounterHelixAbilityValues } from './kv/CounterHelixAbilityValues';

@registerAbility()
class axe_counter_helix_custom extends BaseAbility {
    private _abilityValues: CounterHelixAbilityValues = new CounterHelixAbilityValues(this)

    GetIntrinsicModifierName(): string {
        return modifier_axe_counter_helix_custom.NAME;
    }

    OnUpgrade(): void {
        this._abilityValues.Update();
        this.ResetStackCount();
    }

    OnOwnerSpawned(): void {
        this._abilityValues.Update();
        this.ResetStackCount();
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this._abilityValues.radius() - this.castRangeBonus();
    }

    private castRangeBonus() {
        return this.GetCaster().GetCastRangeBonus();
    }

    private ResetStackCount() {
        const modifierNAme = this.GetIntrinsicModifierName();
        const modifier: CDOTA_Buff = this.GetCaster().FindModifierByName(modifierNAme)!;
        const triggerAttacks = this._abilityValues.triggerAttacks();

        modifier.SetStackCount(triggerAttacks);
    }
}

@registerModifier()
export class modifier_axe_counter_helix_custom extends BaseModifier {
    public static readonly NAME = "modifier_axe_counter_helix_custom"

    private readonly PARTICLE_ATTACHMENT = "attach_attack1";
    private readonly PARTICLES = "particles/units/heroes/hero_axe/axe_counterhelix.vpcf";
    private readonly ANIM = "counter_helix_anim"

    private _ability;
    private _caster;
    private _parent;
    private _abilityValues: CounterHelixAbilityValues;

    private _isAnimating: boolean = false;


    constructor() {
        super();

        this._ability = this.GetAbility()!;
        this._caster = this.GetCaster()!;
        this._parent = this.GetParent()!;
        this._abilityValues = new CounterHelixAbilityValues(this._ability);
    }

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
        this._abilityValues.Update();

        if (IsServer()) {
            const triggerAttacks = this._abilityValues.triggerAttacks();
            this.SetStackCount(triggerAttacks);
        }
    }

    OnRefresh(params: object): void {
        this.OnCreated(params);
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.ON_ATTACK_LANDED,
            ModifierFunction.PROCATTACK_FEEDBACK
        ];
    }

    private ResetStackCount() {
        const triggerAttacks = this._abilityValues.triggerAttacks();
        this.SetStackCount(triggerAttacks);
    }

    GetModifierProcAttack_Feedback(event: ModifierAttackEvent): number {
        if (this.CanAttackFeedbackProc(event)) {
            this.CastAbility();
        }

        return 0;
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        if (this.CanAttackLandedProc(event)) {
            this.CastAbility();
        }
    }

    private CastAbility() {
        this.DecreaseStackCount();

        if (this.GetStackCount() <= 0) {
            this._ability.UseResources(false, false, false, true);
            this._ability.SetFrozenCooldown(true);
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

    // при атаке героем
    // можно запустить, только если прошлый поворот акса завершился
    private CanAttackFeedbackProc(event: ModifierAttackEvent) {
        return IsServer() &&
            this._caster.HasScepter() &&
            !this._caster.PassivesDisabled() &&
            this._ability.IsCooldownReady() &&
            !this._isAnimating &&

            event.target != this._caster &&
            !event.target.IsBuilding() &&
            !event.target.IsWard();

    }

    // При получении атаки от других
    // можно запустить, только если прошлый поворот акса завершился
    private CanAttackLandedProc(event: ModifierAttackEvent) {
        return IsServer() &&
            !this._caster.PassivesDisabled() &&
            this._ability.IsCooldownReady() &&
            !this._isAnimating &&

            event.target == this._caster &&
            !event.attacker.IsBuilding() &&
            !event.attacker.IsWard();
    }

    private CreateVisualSoundEffect() {
        const soundName = KvUtils.GetEmitSoundName(this._ability);
        this._caster.EmitSound(soundName);
        this._caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_3);
        this.startAnimationTimer();
        this.CreateParticles();
    }

    private startAnimationTimer() {
        const animDur = this._caster.SequenceDuration(this.ANIM);

        this._isAnimating = true;
        Timers.CreateTimer(animDur, () => {
            this._isAnimating = false;
            this._ability.SetFrozenCooldown(false);
        })
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
            this._abilityValues.radius(),
            UnitTargetTeam.ENEMY,
            UnitTargetType.HERO + UnitTargetType.BASIC,
            UnitTargetFlags.MAGIC_IMMUNE_ENEMIES,
            FindOrder.ANY,
            true
        );
    }

    private HitEnemies(enemies: CDOTA_BaseNPC[]) {
        for (const enemy of enemies) {
            this.HitEnemy(enemy);
        }
    }

    private HitEnemy(enemy: CDOTA_BaseNPC) {
        let damageMultiplier = this._abilityValues.damageMultiplier();
        let damage = this._caster.GetAverageTrueAttackDamage(this._caster);
        let totalDamage = damage * damageMultiplier;

        ApplyDamage({
            attacker: this._caster,
            damage: totalDamage,
            damage_type: this._ability.GetAbilityDamageType(),
            victim: enemy,
            ability: this._ability,
            damage_flags: DamageFlag.NONE,
        });
    
    }


}
