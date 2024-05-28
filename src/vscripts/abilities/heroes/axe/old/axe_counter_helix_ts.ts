import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { CounterHelixAbilityValues } from "../kv/CounterHelixAbilityValues";

@registerModifier()
// название класса должно быть такое же, как и в KV файле
export class axe_counter_helix_ts extends BaseModifier {
    private static readonly DEBUFF = 'modifier_axe_counter_helix_debuff_ts';
    private static readonly PARTICLE = 'particles/units/heroes/hero_axe/axe_counterhelix.vpcf';
    private static readonly SOUND = 'Hero_Axe.CounterHelix';
    private static readonly ATTACHMENT = 'attach_attack1';

    private _ability = this.GetAbility()!;
    private _caster = this.GetCaster()!;

    private readonly kv: CounterHelixAbilityValues;

    constructor() {
        super();
        print("CONSTR! 1")

        this.kv = new CounterHelixAbilityValues(this._ability);
        print("CONSTR! 2")
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
        print("CREATED!")

        if (IsServer()) {
            const triggerAttacks = this.kv.triggerAttacks();
            this.SetStackCount(triggerAttacks);
        }
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK_LANDED, ModifierFunction.PROCATTACK_BONUS_DAMAGE_PHYSICAL];
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        print("OnAttackLanded")

        if (this.CanCastOnAttackLanded(event)) {
            this.CastAbility()
        }

    }


    GetModifierProcAttack_BonusDamage_Physical(event: ModifierAttackEvent): number {
        print("GetModifierProcAttack_BonusDamage_Physical")
        print("proc attack")
        print("caster attacker" + (this._caster == event.attacker))
        
        if (this.CanCastProcAttack(event)) {
            this.CastAbility()
        }

        return 0;
    }

    private CanCastProcAttack(event: ModifierAttackEvent) {
        return IsServer() &&
            this._caster == event.attacker &&
            !this._caster.PassivesDisabled() &&
            !event.attacker.IsBuilding() &&
            !event.attacker.IsWard() &&
            this._ability.IsCooldownReady();
        }

    private CanCastOnAttackLanded(event: ModifierAttackEvent) {
        return IsServer() &&
            event.target == this._caster &&
            !this._caster.PassivesDisabled() &&
            !event.attacker.IsBuilding() &&
            !event.attacker.IsWard() &&
            this._ability.IsCooldownReady()
    }

    private CastAbility() {
        this._ability.UseResources(false, false, false, true);
        this.DecreaseStackCount();

        if (this.GetStackCount() <= 0) {
            this.RenewStackCount();
            this._caster.EmitSound(axe_counter_helix_ts.SOUND);

            this._caster.StartGesture(GameActivity.DOTA_CAST_ABILITY_3);
            this.CreateParticle();

            const enemies = this.FindEnemies();
            this.HitEnemies(enemies);
        }
    }

    private DecreaseStackCount() {
        this.SetStackCount(this.GetStackCount() - 1);
    }

    private RenewStackCount() {
        const triggerAttacks = this.kv.triggerAttacks();
        this.SetStackCount(triggerAttacks);
    }

    private CreateParticle() {
        const pfx = ParticleManager.CreateParticle(
            axe_counter_helix_ts.PARTICLE,
            ParticleAttachment.ABSORIGIN_FOLLOW,
            this._caster
        );
        ParticleManager.SetParticleControlEnt(
            pfx,
            0,
            this._caster,
            ParticleAttachment.POINT_FOLLOW,
            axe_counter_helix_ts.ATTACHMENT,
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
            this.kv.radius(),
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
        ApplyDamage({
            attacker: this._caster,
            damage: this.kv.damage(),
            damage_type: this._ability.GetAbilityDamageType(),
            victim: enemy,
            ability: this._ability,
            damage_flags: DamageFlag.NONE,
        });

        if (this.HasShard()) {
            enemy.AddNewModifier(this._caster, this._ability, axe_counter_helix_ts.DEBUFF, {
                duration: this.kv.shardDebuffDuration(),
            });
        }
    }

    private HasShard() {
        return this.GetModifierShard && this.GetModifierShard() == 1;
    }
}
