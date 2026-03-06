import {dateStringToDate, formatDate, timeStringToDate} from "@/helper/datetimehelper";
import {PresenceType} from "@/constants/WihTypes/PresenceType";
import {PathDocument} from "@/constants/WihTypes/DtoPatch";

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

export class EventInstanceUpdate {
    private readonly updates: PathDocument = [];

    Date?: Date;
    startTime?: Date;
    endTime?: Date | null;
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

    updateDate(value?: Date) {
        this.Date = value;
        this.addOrUpdate("replace", "/date", value && formatDate(value));
    }

    updateStartTime(value?: Date) {
        this.startTime = value;
        this.addOrUpdate("replace", "/startTime", value && formatDate(value));
    }

    updateEndTime(value?: Date | null) {
        this.endTime = value;
        this.addOrUpdate("replace", "/endTime", value && formatDate(value));
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

