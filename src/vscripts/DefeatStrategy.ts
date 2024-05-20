import { GlobalConstants } from "./GlobalConstants";
import { reloadable } from "./lib/tstl-utils";

@reloadable
export class DefeatStrategy {

    private readonly deadTimerMaxTicks = 5;
    private readonly deadTimerTick = 1;


    constructor() {
        ListenToGameEvent("dota_player_killed", (data) => this.OnPlayerKilled(data), undefined);
    }

    private OnPlayerKilled(data: DotaPlayerKilledEvent): void {
        const alivePlayersCount = this.GetAliveHeroesCount();
        if (alivePlayersCount == 0) {
            this.StartDeadTimer();
        }
    }

    private GetAliveHeroesCount(): number {
        let heroes = HeroList.GetAllHeroes();
        // именно герои, не игроки! (Акс, Лина и тп)
        const aliveHeroes = heroes.filter((e) => {
            const alive = e.IsAlive() || e.IsReincarnating();
            return !e.IsNull() && alive;
        });

        print("remaining alive heroes = " + aliveHeroes.length)

        return aliveHeroes.length;
    }

    private StartDeadTimer(): void {
        print("start dead timer")

        let deadTicks = 0;
        Timers.CreateTimer(() => {
            const alivePlayersCount = this.GetAliveHeroesCount();
            print("dead ticks = " + deadTicks);

            if (alivePlayersCount > 0) {
                return;
            }

            if (deadTicks < this.deadTimerMaxTicks) {
                deadTicks = deadTicks + 1;
                return this.deadTimerTick;
            }


            GameRules.SetGameWinner(GlobalConstants.ENEMY_TEAM);
        });
    }
}
