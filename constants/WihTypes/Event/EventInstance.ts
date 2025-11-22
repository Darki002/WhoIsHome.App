import {dateStringToDate, timeStringToDate} from "@/helper/datetimehelper";
import {PresenceType} from "@/constants/WihTypes/PresenceType";

export interface EventInstanceModel {
    id: number;
    title: string;
    date: string;
    startTime: string;
    endTime?: string | null;
    presenceType: PresenceType;
    dinnerTime?: string | null;
    eventGroupId: number;
    userId: number;
}

export interface EventInstanceDto {
    title?: string;
    date?: string;
    startTime?: string;
    endTime?: string | null;
    presenceType?: PresenceType;
    dinnerTime?: string | null;
}

export class EventInstance {
    id: number = undefined!;
    title: string = "";
    date: Date = undefined!;
    startTime?: Date;
    endTime: Date | null = null;
    presenceType: PresenceType = undefined!;
    dinnerTime?: Date | null;
    eventGroupId: number = undefined!;
    userId: number = undefined!;

    constructor(model?: EventInstanceModel) {
        if (!model) return;

        this.id = model.id;
        this.title = model.title;
        this.date = dateStringToDate(model.date)!;
        this.startTime = timeStringToDate(model.startTime);
        this.endTime = model.endTime ? timeStringToDate(model.endTime) ?? null : null;
        this.presenceType = model.presenceType as PresenceType;
        this.dinnerTime = model.dinnerTime ? timeStringToDate(model.dinnerTime) : null;
        this.eventGroupId = model.eventGroupId;
        this.userId = model.userId;
    }
}

