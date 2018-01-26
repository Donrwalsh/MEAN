import { Injectable } from "@angular/core";
import { PlayerService } from "./core/player.service";
import { NumbersService } from "./core/numbers.service";

@Injectable()
export class OperatingService {

    constructor(public _player: PlayerService,
        public _numbers: NumbersService) { }

    operations;

    areAnyUnlocked() {
        return this.areRoutineOpsUnlocked() || this.areCampaignOpsUnlocked();
    }

    areRoutineOpsUnlocked() {
        //Currently only accounts for Heists.
        return this._player.schemes[6]['level'] > 0 || this._player.schemes[7]['level'] > 0 ;
    }

    areCampaignOpsUnlocked() {
        //No longer planned for Phase 0
        //return this._player.schemes[7]['level'] > 0;
        return false;
    }

    areAscensionOpsUnlocked() {
        return false;
    }

    getRoutineOperationCountdownById(id) {
        if (id >= 0 && id <= 4) { //Hesits
            var rate = 600;
            rate -= this._numbers.heistRechargeRate()
            return rate;
        }
    }

    isUnlockedById(id) {
        if (id >= 0 && id <= 4) return this._numbers.heistUnlocked(id);
    }



    getFaColorById(id) {
        if (this.isUnlockedById(id) && this._player.operating[id]['available']) {
            var rarity = this._player.operating[id]['rarity'];
            return this.getFaColorByRarity(rarity);
        } else {
            return 'white';
        }
    }

    getFaColorByRarity(rarity) {
        if (rarity == 0) { return 'black' }
        if (rarity == 1) { return 'green' }
        if (rarity == 2) { return 'blue' }
        if (rarity == 3) { return 'purple' }
        if (rarity == 4) { return 'orange' }
    }

    previewOperation;
    showPreview = false;
    previewOperationId;

    resetCountdownById(id) {
        this._player.operating[id]['countdown'] = this.getOperationRechargeById(id);
        this._player.operating[id]['lock'] = this.getOperationRechargeById(id);
    }

    getOperationRechargeById(id) {
        if (id >= 0 && id <= 4) { //Heists
            return this.getRoutineOperationCountdownById(id);
        }
    }

    closeCompleteOperation() {
        this.showPreview = false;
        this._player.operating[this.previewOperationId] = {name: '', rarity: -1, henchmen : -1, available: false, reward: -1, success: -1, risk: -1, notoriety: -1, countdown: 0, lock: 0}
        this.resetCountdownById(this.previewOperationId);
        this.operatingNow = false;
        this.previewOperation = [];
        
    }

    operationPreview(id) {
        if (this._player.operating[id]['available']) {
            if (this._player.operating[id] == this.previewOperation) {
                this.showPreview = false;
                this.previewOperation = [];
            } else {
                this.previewOperation = this._player.operating[id];
                this.previewOperationId = id;
                this.showPreview = true;
            }

        }



        //this.previewSchemeLevel = this.getSchemeCurrentLevel(id) + 1;

    }

    operatingNow = false;
    operateReadout = {
        result: '',
        lost: 0,
        earned: 0,
        notoriety: 0
    };

    operate() {
        if (this.canPreviewBeOperated) {
            this.operateReadout = {result: '', lost: 0, earned: 0, notoriety: 0};
            this.operatingNow = true;
            var roll = Math.random() <= this.previewOperation['success']
            this.operateReadout['result'] = roll ? 'success!' : 'failure.';
            var lost = 0;
            if (roll) {
                this.operateReadout['earned'] = this.previewOperation['reward'];
                this._player.cash += this.previewOperation['reward'];
                for (var _i = 0; _i < this.previewOperation['henchmen']; _i++) {
                    lost += Math.random() <= this.previewOperation['risk'] ? 1 : 0;
                }
            } else {
                lost = this.previewOperation['henchmen']
            }
            this.operateReadout['lost'] = lost;
            this._player.currentHenchmen -= lost;
            this.operateReadout['notoriety'] = this.previewOperation['notoriety'];
            this._player.notoriety += this.operateReadout['notoriety']*10;
        }
    }

    getHeistHenchmenCost(rarity) {
        var multiplier;
        if (rarity == 0) { multiplier = 5 }
        if (rarity == 1) { multiplier = 10 }
        if (rarity == 2) { multiplier = 20 }
        if (rarity == 3) { multiplier = 50 }
        if (rarity == 4) { multiplier = 100 }
        return Math.ceil(Math.random() * multiplier)
    }

    getHeistCashOutput(rarity, henchmen) {
        var multiplier;
        if (rarity == 0) { multiplier = 1 }
        if (rarity == 1) { multiplier = 1.2 }
        if (rarity == 2) { multiplier = 1.5 }
        if (rarity == 3) { multiplier = 1.7 }
        if (rarity == 4) { multiplier = 2 }
        return Math.floor(henchmen * multiplier)
    }

    getHeistSuccessRate(rarity) {
        var rate;
        if (rarity == 0) { rate = .9 }
        if (rarity == 1) { rate = .8 }
        if (rarity == 2) { rate = .7 }
        if (rarity == 3) { rate = .6 }
        if (rarity == 4) { rate = .5 }
        return rate;
    }

    getHeistRiskRate(rarity) {
        var rate;
        if (rarity == 0) { rate = .15 }
        if (rarity == 1) { rate = .2 }
        if (rarity == 2) { rate = .25 }
        if (rarity == 3) { rate = .3 }
        if (rarity == 4) { rate = .35 }
        var multiplier = 1;
        for (var i = 0; i < this._player.schemes[8]['level']; i++) {
            multiplier -= .05;
        }
        return rate * multiplier;
    }

    previewOperationRiskDisplay() {
        return Math.floor(this.previewOperation['risk'] * 10000) / 100;
    }

    getHeistNotoriety(rarity) {
        return Math.floor((rarity * .1) * 100) / 100;
    }

    getPercentageById(id) {
        return 100 * (1 - (this._player.operating[id]['countdown'] / this._player.operating[id]['lock']))
    }

    tickById(id) {
        if (this.isUnlockedById(id)) {
            //If lock and countdown are both 0, the operation slot has been unlocked since the last tick.
            if (this._player.operating[id]['lock'] == 0 && this._player.operating[id]['countdown'] == 0) {
                this.operationSpawn(id);
            }
            //If the operation is available, recheck certain values that may have changed:
            if (this._player.operating[id]['available']) {
                this._player.operating[id]['risk'] = this.getHeistRiskRate(this._player.operating[id]['rarity']);
            }
            this._player.operating[id]['countdown']--;
            if (this._player.operating[id]['countdown'] == 0) {
                this.operationSpawn(id);
            }
        }


    }

    get heistCountdown() {
        //Default is 3 minutes
        return 1800;
    }

    pickAHeistName(rarity) {
        var tiers = ['Tier0', 'Tier1', 'Tier2', 'Tier3', 'Tier4']
        var cap = this.operations[0][tiers[rarity]].length;
        return this.operations[0][tiers[rarity]][Math.floor(Math.random() * cap)];
    }

    operationSpawn(id) {
        if (id >= 0 && id <= 4) {//Heists
            var rarity = this.rollHeistRarity();
            var henchmen = this.getHeistHenchmenCost(rarity);
            this._player.operating[id]['name'] = this.pickAHeistName(rarity);
            this._player.operating[id]['rarity'] = rarity;
            this._player.operating[id]['henchmen'] = henchmen;
            this._player.operating[id]['reward'] = this.getHeistCashOutput(rarity, henchmen);
            this._player.operating[id]['success'] = this.getHeistSuccessRate(rarity);
            this._player.operating[id]['risk'] = this.getHeistRiskRate(rarity);
            this._player.operating[id]['notoriety'] = this.getHeistNotoriety(rarity);
            this._player.operating[id]['available'] = true;
            //Reset the countdown in case it was 0.
            this._player.operating[id]['lock'] = this.heistCountdown;

        }
    }

    get heistRarityChances() {
        return this._numbers.heistRarityChancesArray;
    }

    get canPreviewBeOperated() {
        return this._player.currentHenchmen >= this.previewOperation['henchmen'];
    }

    //Heists specifically
    rollHeistRarity() {
        var roll = Math.random();
        var heistRarityChances = this._numbers.heistRarityChancesArray();
        if (roll <= heistRarityChances[0]) { return 0 }
        if (roll >= heistRarityChances[0] && roll <= heistRarityChances[1]) { return 1 }
        if (roll >= heistRarityChances[1] && roll <= heistRarityChances[2]) { return 2 }
        if (roll >= heistRarityChances[2] && roll <= heistRarityChances[3]) { return 3 }
        if (roll >= heistRarityChances[3] && roll <= heistRarityChances[4]) { return 4 }
    }

}