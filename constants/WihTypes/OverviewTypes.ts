import {dateStringToDate, timeStringToDate} from "@/helper/datetimehelper";

export interface UserOverviewEventModel {
    id: number;
    title: string;
    date: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    templateId: number;
}

export class UserOverviewEvent {
    id: number;
    title: string;
    templateId: number;
    date: Date | undefined;
    startTime: Date | undefined;
    endTime: Date | undefined;

    constructor(wihEventDto: UserOverviewEventModel) {
        this.id = wihEventDto.id;
        this.title = wihEventDto.title;
        this.templateId = wihEventDto.templateId;
        this.startTime = timeStringToDate(wihEventDto.startTime);
        this.endTime = timeStringToDate(wihEventDto.endTime);
        this.date = dateStringToDate(wihEventDto.date);
    }
}

export type UserOverviewDto = {
    userId: number;
    today: UserOverviewEventModel[];
    thisWeek: UserOverviewEventModel[];
    futureEvents: UserOverviewEventModel[];
}

export class UserOverview {
    UserId: number;
    Today: UserOverviewEvent[];
    ThisWeek: UserOverviewEvent[];
    FutureEvents: UserOverviewEvent[];

    constructor(userOverviewDto: UserOverviewDto) {
        this.UserId = userOverviewDto.userId;
        this.Today = userOverviewDto.today.map(e => new UserOverviewEvent(e))
        this.ThisWeek = userOverviewDto.thisWeek.map(e => new UserOverviewEvent(e))
        this.FutureEvents = userOverviewDto.futureEvents.map(e => new UserOverviewEvent(e))
    }
}