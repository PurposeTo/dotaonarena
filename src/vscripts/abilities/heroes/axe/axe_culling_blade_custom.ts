import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../../../lib/dota_ts_adapter';
import { KvUtils } from '../../../utils/KvUtils';
import { CullingBladeAbilityValues } from './kv/CullingBladeAbilityValues';

@registerAbility()
class axe_culling_blade_custom extends BaseAbility {
    GetIntrinsicModifierName(): string {
        return modifier_axe_culling_blade_custom.NAME;
    }

}

@registerModifier()
class modifier_axe_culling_blade_custom extends BaseModifier {
    public static readonly NAME = "modifier_axe_culling_blade_custom"

    private _ability = this.GetAbility()!;
    private _caster = this.GetCaster()!;
    private _abilityValues: CullingBladeAbilityValues = new CullingBladeAbilityValues(this._ability)

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

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PROCATTACK_FEEDBACK];
    }

    OnCreated(params: object): void {
        this._abilityValues.Update();
    }

    GetModifierProcAttack_Feedback(event: ModifierAttackEvent): number {
        let damageMultiplier = this._abilityValues.damageMultiplier();
        let damage = this._caster.GetAverageTrueAttackDamage(this._caster);
        let killDamage = damage * damageMultiplier;

        if (this.CanAttackFeedbackProc(event)) {
            let enemy = event.target
            let enemyHp = enemy.GetHealth();

            let canInstantKill = enemyHp <= killDamage
            if (canInstantKill)  {
                this.CreateVisualSoundEffect(enemy);
                enemy.Kill(this._ability, this._caster);
            }
        }

        return 0;
    }

    private CanAttackFeedbackProc(event: ModifierAttackEvent) {
        return IsServer() &&
            !this._caster.PassivesDisabled() &&

            event.target != this._caster &&
            !event.target.IsBuilding() &&
            !event.target.IsWard();

    }

    private CreateVisualSoundEffect(target: CDOTA_BaseNPC) {
        const soundName = KvUtils.GetEmitSoundName(this._ability);
        this._caster.EmitSound(soundName);

        // todo реализовать частицы как в оригинальной доте
        const pfx = ParticleManager.CreateParticle(
            'particles/units/heroes/hero_axe/axe_culling_blade_pool.vpcf',
            ParticleAttachment.ABSORIGIN_FOLLOW,
            target
        );
        ParticleManager.SetParticleControl(pfx, 1, Vector(1, 1, 1));
        ParticleManager.ReleaseParticleIndex(pfx);
    }

}