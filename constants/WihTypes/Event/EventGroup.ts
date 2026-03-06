import {dateStringToDate, formatDate, timeStringToDate} from "@/helper/datetimehelper";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {PathDocument} from "@/constants/WihTypes/DtoPatch";

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

export class EventGroupUpdate {
    private readonly updates: PathDocument = [];

    title?: string;
    startDate?: Date;
    endDate?: Date | null;
    startTime?: Date;
    endTime?: Date | null;
    weekDays?: number[];
    presenceType?: PresenceType;
    dinnerTime?: Date | null;

    private addOrUpdate(op: string, path: string, value: any) {
        const index = this.updates.findIndex(u => u.path === path);

        if (value === undefined) {
            this.updates.splice(index, 1);
            return;
        }

        const newOp = { op, path, value };

        if (index !== -1) {
            this.updates[index] = newOp;
        } else {
            this.updates.push(newOp);
        }
        return this;
    }

    updateTitle(title: string) {
        this.title = title;
        this.addOrUpdate("replace", "/title", title);
    }

    updateStartDate(value?: Date) {
        this.startDate = value;
        this.addOrUpdate("replace", "/startDate", value && formatDate(value));
    }

    updateEndDate(value?: Date | null) {
        this.endDate = value;
        this.addOrUpdate("replace", "/endDate", value && formatDate(value));
    }

    updateStartTime(value?: Date) {
        this.startTime = value;
        this.addOrUpdate("replace", "/startTime", value && formatDate(value));
    }

    updateEndTime(value?: Date | null) {
        this.endTime = value;
        this.addOrUpdate("replace", "/endTime", value && formatDate(value));
    }

    updateWeekDays(value: number[]) {
        this.weekDays = value;
        this.addOrUpdate("replace", "/weekDays", value);
    }

    updatePresenceType(value?: PresenceType) {
        this.presenceType = value;
        this.addOrUpdate("replace", "/presenceType", value);
    }

    updateDinnerTime(value?: Date | null) {
        this.dinnerTime = value;
        this.addOrUpdate("replace", "/dinnerTime", value && formatDate(value));
    }

    getUpdates() {
        return this.updates;
    }
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

