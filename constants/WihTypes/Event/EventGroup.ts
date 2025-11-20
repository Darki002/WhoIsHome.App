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

export interface EventGroupModelDto {
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
    id?: number;
    title?: string;
    startDate?: Date;
    endDate?: Date | null;
    startTime?: Date;
    endTime?: Date | null;
    weekDays?: number[];
    presenceType?: PresenceType;
    dinnerTime?: Date | null;
    userId?: number;

    constructor(model?: EventGroupModel) {
        if (!model) return;

        this.id = model.id;
        this.title = model.title;
        this.startDate = dateStringToDate(model.startDate);
        this.endDate = model.endDate ? dateStringToDate(model.endDate) : null;
        this.startTime = timeStringToDate(model.startTime);
        this.endTime = model.endTime ? timeStringToDate(model.endTime) : null;
        this.weekDays = model.weekDays;
        this.presenceType = model.presenceType;
        this.dinnerTime = model.dinnerTime ? timeStringToDate(model.dinnerTime) : null;
        this.userId = model.userId;
    }
}

