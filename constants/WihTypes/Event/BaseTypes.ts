import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {timeStringToDate} from "@/helper/datetimehelper";

export type EventType = "OneTimeEvent" | "RepeatedEvent";

export type WihEvent = {
    id: number;
    title: string;
    date: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    eventType: EventType;
}

export interface EventModelBase {
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

    constructor(eventModelBase: EventModelBase) {
        this.Title = eventModelBase.title;
        this.PresenceType = eventModelBase.presenceType;

        this.StartTime = timeStringToDate(eventModelBase.startTime);
        this.EndTime = timeStringToDate(eventModelBase.endTime);
        this.DinnerTime = timeStringToDate(eventModelBase.dinnerTime ?? undefined);
    }
}