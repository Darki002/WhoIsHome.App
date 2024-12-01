export type User = {
    id: number;
    userName: string;
    email: string;
}

export type WihEvent = {
    id: number;
    title: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    eventType: string;
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

export interface OneTimeEvent {
    Title?: string;
    Date?: Date;
    StateTime?: Date;
    EndTime?: Date;
    PresenceType?: PresenceType;
    DinnerTime?: Date | null;
}

export interface OneTimeEventDto {
    Title: string;
    Date: string;
    StateTime: string;
    EndTime: string;
    PresenceType: PresenceType;
    DinnerTime: string | null;
}

export interface RepeatedEvent {
    Title?: string;
    FirstOccurrence?: Date;
    LastOccurrence?: Date;
    StateTime?: Date;
    EndTime?: Date;
    PresenceType?: PresenceType;
    DinnerTime?: Date | null;
}

export interface RepeatedEventDto {
    Title?: string;
    FirstOccurrence?: string;
    LastOccurrence?: string;
    StateTime?: string;
    EndTime?: string;
    PresenceType?: PresenceType;
    DinnerTime?: string | null;
}

export type PresenceType = "Unknown" | "Default" | "Late" | "NotPresent";

export const PresenceTypes : Array<PresenceType> = ["Unknown", "Default", "Late", "NotPresent"];