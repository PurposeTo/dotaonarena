import { reloadable } from "../lib/tstl-utils";

@reloadable
export class RestState {

    // configs
    private static REST_TIME = 10;
    private static SHOP_NAME = "global_shop";

    private onStateEnd: Runnable = () => {};

    private shopTrigger: CBaseTrigger;

    constructor() {
        this.shopTrigger = Entities.FindByName(undefined, RestState.SHOP_NAME)! as CBaseTrigger;
    }

    public Listen(onStateEnd: Runnable) {
        this.onStateEnd = onStateEnd;
    }

    public StartState() {
        this.shopTrigger.Enable();
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
