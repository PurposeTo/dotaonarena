import { reloadable } from "../lib/tstl-utils";

@reloadable
export class RestState {

    // configs
    private static REST_TIME = 10;

    private onStateEnd: Runnable = () => {};

    public Listen(onStateEnd: Runnable) {
        this.onStateEnd = onStateEnd;
    }

    public StartState() {
        // todo: open shop
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
