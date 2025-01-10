import {dateStringToDate, timeStringToDate} from "@/helper/datetimehelper";

export type EventType = "OneTimeEvent" | "RepeatedEvent";

export interface WihEventDto {
    id: number;
    title: string;
    date: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    eventType: EventType;
}

export class WihEvent {
    Id: number;
    Title: string;
    EventType: EventType;
    Date: Date | undefined;
    StartTime: Date | undefined;
    EndTime: Date | undefined;

    constructor(wihEventDto: WihEventDto) {
        this.Id = wihEventDto.id;
        this.Title = wihEventDto.title;
        this.EventType = wihEventDto.eventType;
        this.StartTime = timeStringToDate(wihEventDto.startTime);
        this.EndTime = timeStringToDate(wihEventDto.endTime);
        this.Date = dateStringToDate(wihEventDto.date);
    }
}