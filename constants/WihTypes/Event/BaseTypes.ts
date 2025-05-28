import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {timeStringToDate} from "@/helper/datetimehelper";

export interface EventModelBase {
    id?: number;
    title?: string;
    startTime?: Date | string;
    endTime?: Date | string | null;
    presenceType?: PresenceType;
    dinnerTime?: Date | null;
    userId: number;
}

export interface EventDtoBase {
    Title: string;
    StartTime: string;
    EndTime: string | null;
    PresenceType: PresenceType;
    DinnerTime: string | null;
}

export class EventBase {
    Title?: string;
    StartTime?: Date;
    EndTime?: Date | null;
    PresenceType?: PresenceType;
    DinnerTime?: Date | null;
    UserId?: number;

    constructor(eventModelBase?: EventModelBase) {

        if(!eventModelBase){
            return;
        }

        this.Title = eventModelBase.title;
        this.PresenceType = eventModelBase.presenceType;
        this.UserId = eventModelBase.userId;

        this.StartTime = timeStringToDate(eventModelBase.startTime);
        this.EndTime = eventModelBase.endTime ? timeStringToDate(eventModelBase.endTime) : null;
        this.DinnerTime = eventModelBase.dinnerTime ? timeStringToDate(eventModelBase.dinnerTime) : null;
    }
}