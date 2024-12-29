import {PresenceType} from "@/constants/WihTypes/PresenceType";

export type EventType = "OneTimeEvent" | "RepeatedEvent";

export type WihEvent = {
    id: number;
    title: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    eventType: EventType;
}

export interface EventBase {
    Title?: string;
    StartTime?: Date;
    EndTime?: Date;
    PresenceType?: PresenceType;
    DinnerTime?: Date | null;
}

export interface EventModelBase {
    title?: string;
    startTime?: Date;
    endTime?: Date;
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