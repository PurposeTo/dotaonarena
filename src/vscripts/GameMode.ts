import { reloadable } from "./lib/tstl-utils";
import { GameStateListener } from "./listeners/GameStateListener";
import { GlobalConstants } from "./GlobalConstants";
import { PlayerDeathTombstone } from "./gamemechanics/PlayerDeathTombstone";
import { SharePlayerExp } from "./gamemechanics/SharePlayerExp";
import { SpawnPoint } from "./spawn/SpawnPoint";
import { TroopsSpawner } from "./spawn/troops/TroopsSpawner";
import { TroopsMap } from "./spawn/troops/TroopsMap";
import { TroopsReader } from "./spawn/troops/reader/TroopsReader";
import { TroopDto } from "./spawn/troops/dto/TroopDto";
import { Invade } from "./spawn/waves/Invade";
import { WaveBuilder } from "./spawn/wavebuilding/WaveBuilder";
import { Waves } from "./spawn/waves/Waves";
import { WavesProperties } from "./spawn/waves/WavesProperties";
import { PlayerInitLvl } from "./gamemechanics/PlayerInitLvl";
import { GameModeProperties } from "./gamemode/gameModeProperties";

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {

    private properties = GameModeProperties.Read();

    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheItemByNameSync("item_tombstone", context);
        PrecacheResource("particle", "particles/units/heroes/hero_axe/axe_counterhelix.vpcf", context);
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();
        this.configureToolMode();

        new GameStateListener();
        new PlayerInitLvl();

        new PlayerDeathTombstone();
        new SharePlayerExp();

        let wavesProps = WavesProperties.Read();

        let entity = Entities.FindByName(undefined, "spawn_point") as CBaseEntity;
        let point = new SpawnPoint(entity);

        let troops: TroopDto[] = new TroopsReader().Read();
        let troopsMap = new TroopsMap();
        troopsMap.SetAll(troops);

        let troopsShop = new WaveBuilder(troops);
        let spawner = new TroopsSpawner(point, wavesProps.maxEnemies, wavesProps.spawnDelay);
        let invade = new Invade(troopsShop, spawner, wavesProps);

        new Waves(invade, wavesProps.restTime);
    }

    private configure(): void {
        const gameModeEntity = GameRules.GetGameModeEntity();

        // доступные команды для игроков
        GameRules.SetCustomGameTeamMaxPlayers(GlobalConstants.PLAYERS_TEAM, this.properties.teamMaxPlayers);
        GameRules.SetCustomGameTeamMaxPlayers(GlobalConstants.ENEMY_TEAM, 0);

        Tutorial.SelectPlayerTeam(GlobalConstants.PLAYERS_TEAM.toString());

        // стадия выбора команды
        GameRules.LockCustomGameSetupTeamAssignment(true);
        GameRules.SetCustomGameSetupAutoLaunchDelay(this.properties.autoLaunchDelay);

        // стадия выбора героя
        GameRules.SetHeroSelectionTime(this.properties.heroSelectionTime);

        // стадия стратегии и showcase
        GameRules.SetStrategyTime(this.properties.strategyTime);
        GameRules.SetShowcaseTime(this.properties.showcaseTime);

        // стадия "до нулевой"
        GameRules.SetPreGameTime(this.properties.preGameTime);
        gameModeEntity.SetAnnouncerDisabled(true);

        // магазин предметов
        GameRules.SetUseUniversalShopMode(true);
        GameRules.SetStartingGold(this.properties.startGold);

        // общие игровые правила
        gameModeEntity.SetTowerBackdoorProtectionEnabled(false);

        // настройки смерти игрока
        gameModeEntity.SetBuybackEnabled(false);
        gameModeEntity.SetLoseGoldOnDeath(false);
        GameRules.SetHeroRespawnEnabled(false);
    }

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }

    // настройки для игры в режиме разработчика
    private configureToolMode(): void {

        if (!IsInToolsMode()) {
            return;
        }

        print("Game running in the tool mode");

        const gameModeEntity = GameRules.GetGameModeEntity();
        gameModeEntity.SetCustomGameForceHero("npc_dota_hero_axe");
    }
}
