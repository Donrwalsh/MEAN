import { Injectable } from "@angular/core";
import { Base } from '../base';
import { BaseNum } from '../base-num';

@Injectable()
export class InventoryService extends BaseNum {

    constructor() {
            super();
    }

    //While the player service holds the current inventory variables, this service busies
    //itself with deriving capacity and other derived inventory values.

    get guardCapacity() {
        var capacity = 1;
        capacity += this.kingsCastleGuardCapacity();
        return capacity;
    }

    isHenchmenUpgradeFullById(id) {
        if (id == 0) { return this.isGuardCapacityFull }
    }

    get isGuardCapacityFull() {
        return Base.CURRENT_GUARDS == this.guardCapacity;
    }

    get henchmenCapacity() {
        var capacity = 10;
        capacity += this.lodgingNumbers();
        return capacity;
    }

    get isHenchmenCapacityFull() {
        return Base.CURRENT_HENCHMEN == this.henchmenCapacity;
    }

}