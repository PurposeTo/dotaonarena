
export class Process {


    private _running: boolean = false

    private readonly _delaySec: number
    private readonly _doneCheck: Predicate
    private readonly _runnable: Runnable

    constructor(doneCheck: Predicate, runnable: Runnable, delaySec: number) 
    {
        this._doneCheck = doneCheck
        this._runnable = runnable
        this._delaySec = delaySec
    }

    // works like while cycle
    public Run() {
        if(this._running) return
        this._running = true;

         Timers.CreateTimer(() => {
            if(this.Done()) {
                return
            }

            this._runnable()
            return this._delaySec
        });
    }

    private Done(): boolean {
        let value = this._doneCheck()
        if(value) {
            this._running = false;
        }

        return value;
    }

}
