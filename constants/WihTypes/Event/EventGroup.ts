import {dateStringToDate, timeStringToDate} from "@/helper/datetimehelper";
import {PresenceType} from "@/constants/WihTypes/PresenceType";

export interface EventGroupModel {
    id: number;
    title: string;
    startDate: string;
    endDate?: string | null;
    startTime: string;
    endTime?: string | null;
    weekDays: number[];
    presenceType: PresenceType;
    dinnerTime?: string | null;
    userId: number;
}

export interface EventGroupDto {
    title?: string;
    startDate?: string;
    endDate?: string | null;
    startTime?: string;
    endTime?: string | null;
    weekDays?: number[];
    presenceType?: PresenceType;
    dinnerTime?: string | null;
}

export class EventGroup {
    id: number = undefined!;
    title: string = "";
    startDate: Date = undefined!;
    endDate?: Date | null;
    startTime?: Date;
    endTime: Date | null = null;
    weekDays: number[] = [];
    presenceType: PresenceType = undefined!;
    dinnerTime?: Date | null;
    userId: number = undefined!;

    constructor(model?: EventGroupModel) {
        if (!model) return;

        this.id = model.id;
        this.title = model.title;
        this.startDate = dateStringToDate(model.startDate)!;
        this.endDate = model.endDate ? dateStringToDate(model.endDate) : null;
        this.startTime = timeStringToDate(model.startTime);
        this.endTime = model.endTime ? timeStringToDate(model.endTime) ?? null : null;
        this.weekDays = model.weekDays;
        this.presenceType = model.presenceType;
        this.dinnerTime = model.dinnerTime ? timeStringToDate(model.dinnerTime) : null;
        this.userId = model.userId;
    }
}

