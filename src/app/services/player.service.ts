import { Injectable } from "@angular/core";
import { PACKAGE_ROOT_URL } from "@angular/core/src/application_tokens";

@Injectable()
export class PlayerService {

    //Everything in this service is saved. All game details can be derived from this service.

    //Not yet implemented, but used for scheme prereqs
    lairLevel: number = 0;

    //Primary scheme object. Stores level and accumulated exp toward next level by scheme ref.
    schemes: Array<Object> = [
        { level: 0, exp: 0 }, //0 Mastermind, fully coded.
        { level: 0, exp: 0 }, //1 Cold Logic, fully coded.
        { level: 0, exp: 0 }, //2 Quick Thinking, fully coded.
        { level: 0, exp: 0 }, //3 Hired Help, 0-4 coded.
        { level: 0, exp: 0 }, //4 Guard Duty, 0-3 coded.
        { level: 0, exp: 0 }, //5 Henchmen Lodging, 0-4 coded.
        { level: 0, exp: 0 }, //6 Heists, not coded.
        { level: 0, exp: 0 }, //7 Spread Influence, not coded.
        { level: 0, exp: 0 }  //8 Communications, not coded.
    ]

    currentScheme: Object = {};

    //Henchmen
    currentHenchmen: number = 0;
    recruiting: Array<Object> = [
        {currentStore : 0, capacity : 0, countdown : 0, lock : 0 } //Help Wanted 1
    ]

    //Improved Henchmen
    currentGuards: number = 0;
    training: Array<Object> = [
        {currentStore :  0, capacity : 0, queued : 0, countdown : 0, lock : 0} //Guards
            
    ]
}