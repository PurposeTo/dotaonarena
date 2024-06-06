import { reloadable } from "../lib/tstl-utils";
import { Shop } from "../shop/Shop";

@reloadable
export class RestState {

    // configs
    private static REST_TIME = 10;

    private onStateEnd: Runnable = () => {};

    private shop = new Shop();

    public Listen(onStateEnd: Runnable) {
        this.onStateEnd = onStateEnd;
    }

    public StartState() {
        this.shop.Open();
        Timers.CreateTimer(RestState.REST_TIME, () => this.EndState());
    }

    private EndState() {
        this.Clear();
        this.onStateEnd();
    }

    private Clear() {
        // nothing
    }
}
