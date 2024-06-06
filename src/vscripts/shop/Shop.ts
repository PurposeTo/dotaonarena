import { reloadable } from "../lib/tstl-utils";

@reloadable
export class Shop {
    private static SHOP_NAME = "global_shop";

    private shopTrigger: CBaseTrigger;

    private _isOpen: boolean;

    constructor() {
        this.shopTrigger = Entities.FindByName(undefined, Shop.SHOP_NAME)! as CBaseTrigger;
        this._isOpen = true;

        const gameModEnt = GameRules.GetGameModeEntity();
        gameModEnt.SetExecuteOrderFilter((data) => this.ShopUsingFilter(data), this);
    }

    public Open() {
        this.shopTrigger.Enable();
        this._isOpen = true;
    }

    public Close() {
        this.shopTrigger.Disable();
        this._isOpen = false;
    }

    private ShopUsingFilter(event: ExecuteOrderFilterEvent): boolean {
        const type = event.order_type;
        if (type == UnitOrder.PURCHASE_ITEM) {
            return this._isOpen;
        }

        return true;
    }

}