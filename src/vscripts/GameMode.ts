import { reloadable } from "./lib/tstl-utils";
import { EntityKilledListener } from "./listeners/EntityKilledListener";
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
import { TroopsShop } from "./spawn/troopsshop/TroopsShop";
import { Waves } from "./spawn/waves/Waves";
import { WavesProperties } from "./spawn/waves/WavesProperties";

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {

    private static readonly autoLaunchDelay = 5;
    private static readonly heroSelectionTime = 20;
    private static readonly preGameDelay = 5;

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
        // new EntityKilledListener(); Вынести логи в отдельную категорию

        new PlayerDeathTombstone();
        new SharePlayerExp();

        let wavesProps = WavesProperties.Read();
        DeepPrintTable(wavesProps);

        let entity = Entities.FindByName(undefined, "spawn_point") as CBaseEntity;
        let point = new SpawnPoint(entity);

        let troops: TroopDto[] = new TroopsReader().Read();
        let troopsMap = new TroopsMap();
        troopsMap.SetAll(troops);

        let troopsShop = new TroopsShop(troops);
        let spawner = new TroopsSpawner(point, wavesProps.MAX_ENEMIES, wavesProps.SPAWN_DELAY);
        let invade = new Invade(troopsShop, spawner, wavesProps);

        new Waves(invade, wavesProps.REST_TIME);
    }

    private configure(): void {
        const gameModeEntity = GameRules.GetGameModeEntity();

        // доступные команды для игроков
        GameRules.SetCustomGameTeamMaxPlayers(GlobalConstants.PLAYERS_TEAM, 5);
        GameRules.SetCustomGameTeamMaxPlayers(GlobalConstants.ENEMY_TEAM, 0);

        Tutorial.SelectPlayerTeam(GlobalConstants.PLAYERS_TEAM.toString());

        // стадия выбора команды
        GameRules.LockCustomGameSetupTeamAssignment(true);
        GameRules.SetCustomGameSetupAutoLaunchDelay(GameMode.autoLaunchDelay);

        // стадия выбора героя
        GameRules.SetHeroSelectionTime(GameMode.heroSelectionTime);

        // стадия стратегии и showcase
        GameRules.SetStrategyTime(0);
        GameRules.SetShowcaseTime(0);

        // стадия "до нулевой"
        GameRules.SetPreGameTime(GameMode.preGameDelay);
        gameModeEntity.SetAnnouncerDisabled(true);

        // магазин предметов
        GameRules.SetUseUniversalShopMode(true);

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

        GameRules.SetCustomGameSetupAutoLaunchDelay(0);
        gameModeEntity.SetCustomGameForceHero("npc_dota_hero_axe");
        GameRules.SetPreGameTime(0);
        GameRules.SetStartingGold(50000);
    }
}
