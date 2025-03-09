import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {timeStringToDate} from "@/helper/datetimehelper";

export interface EventModelBase {
    id?: number;
    title?: string;
    startTime?: Date | string;
    endTime?: Date | string;
    presenceType?: PresenceType;
    dinnerTime?: Date | null;
    userId: number;
}

export interface EventDtoBase {
    Title: string;
    StartTime: string;
    EndTime: string;
    PresenceType: PresenceType;
    DinnerTime: string | null;
}

export class EventBase {
    Title?: string;
    StartTime?: Date;
    EndTime?: Date;
    PresenceType?: PresenceType;
    DinnerTime?: Date | null;

    constructor(eventModelBase?: EventModelBase) {

        if(!eventModelBase){
            return;
        }

        this.Title = eventModelBase.title;
        this.PresenceType = eventModelBase.presenceType;

        this.StartTime = timeStringToDate(eventModelBase.startTime);
        this.EndTime = timeStringToDate(eventModelBase.endTime);
        this.DinnerTime = eventModelBase.dinnerTime ? timeStringToDate(eventModelBase.dinnerTime) : null;
    }
}