import { Injectable } from "@angular/core";
import { PlayerService } from "./core/player.service";
import { InventoryService } from "./inventory.service";
import { NumbersService } from './core/numbers.service';
import { OperatingService } from './operating.service';
import { Recruit } from '../models/recruit';
import { Base } from '../base';
import { BaseNum } from '../base-num';

@Injectable()
export class RecruitingService extends BaseNum {

    constructor(public _player: PlayerService,
        public _numbers: NumbersService,
        public _operating: OperatingService,
        public _inventory: InventoryService) { 
            super();
        }

    //STRUCTURAL VARIABLES
    recruits: Array<Recruit>; //Raw Recruitment objects. Constructed by app.component.
    collecting: boolean = false; //Collection lockout

    //Section displays only if a recruiting object has been unlocked
    areAnyUnlocked() {
        for (var _i = 0; _i < this.recruits.length; _i++) {
            if (this.recruits[_i].isUnlocked) {
                return true;
            }
        }
        return false;
    }

    //ACTIONS

    //Harvesting training objects.
    collectById(id) {
        if (this.recruits[id].currentStore > 0) {
            if (!this.collecting) {
                this.collecting = true;
                var collectMarker = this.recruits[id].currentStore;
                for (var _i = 0; _i < collectMarker; _i++) {
                    if (Base.CURRENT_HENCHMEN < this._inventory.henchmenCapacity) {
                        Base.CURRENT_HENCHMEN++;
                        this._player.recruiting[id]['currentStore']--; //Modifies player service
                    }
                }
                if (this.recruits[id].countdown == 0) {
                    this.resetCountdownById(id);
                }
                this.collecting = false;
            }
        }
    }

    //Determinining countdown numbers
    getRecruitingCountdownById(id) {
        if (id == 0 || id == 1) { //Help Wanted Objects
            var rate = 90;
            rate -= this._numbers.hiredHelpRecruitRate()
            return rate;
        }
    }

    resetCountdownById(id) {
        this._player.recruiting[id]['countdown'] = this.getRecruitingCountdownById(id);
        this._player.recruiting[id]['lock'] = this.getRecruitingCountdownById(id);
    }

    //LOOP
    tickById(id) {
        if (this.recruits[id].countdown == 0) {
            this.resetCountdownById(id);
        }
        this._player.recruiting[id]['countdown']--;
        if (this.recruits[id].countdown == 0) {
            this._player.recruiting[id]['currentStore']++;
            if (!this.recruits[id].isFull) {
                this.resetCountdownById(id);
            }
        }
    }

}