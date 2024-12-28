export type User = {
    id: number;
    userName: string;
    email: string;
}

export type EventType = "oneTime" | "repeated";

export type WihEvent = {
    id: number;
    title: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    eventType: EventType;
}

export type UserOverview = {
    userId: number;
    today: WihEvent[];
    thisWeek: WihEvent[];
    futureEvents: WihEvent[];
}

export type Tokens = {
    jwtToken: string | null;
    refreshToken: string | null;
}

export interface EventBase {
    Title?: string;
    StartTime?: Date;
    EndTime?: Date;
    PresenceType?: PresenceType;
    DinnerTime?: Date | null;
}

export interface EventModelBase extends EventBase{
    UserId: number;
}

export interface OneTimeEvent extends EventBase {
    Date?: Date
}

export interface OneTimeEventModel extends EventModelBase {
    Date?: Date
}

export interface OneTimeEventDto {
    Title: string;
    Date: string;
    StartTime: string;
    EndTime: string;
    PresenceType: PresenceType;
    DinnerTime: string | null;
}

export interface RepeatedEvent extends EventBase {
    FirstOccurrence?: Date;
    LastOccurrence?: Date;
}

export interface RepeatedEventModel extends EventModelBase {
    FirstOccurrence?: Date;
    LastOccurrence?: Date;
}

export interface RepeatedEventDto {
    Title?: string;
    FirstOccurrence?: string;
    LastOccurrence?: string;
    StartTime?: string;
    EndTime?: string;
    PresenceType?: PresenceType;
    DinnerTime?: string | null;
}

export type PresenceType = "Unknown" | "Default" | "Late" | "NotPresent";

export const PresenceTypes: Array<PresenceType> = ["Unknown", "Default", "Late", "NotPresent"];