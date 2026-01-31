import {dateStringToDate, formatDate, timeStringToDate} from "@/helper/datetimehelper";

export interface UserOverviewEventModel {
    id: number;
    title: string;
    date: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    hasRepetitions: boolean;
    templateId: number;
}

export class UserOverviewEvent {
    id: number;
    title: string;
    date: Date | undefined;
    dateString: string = undefined!;
    startTime: Date | undefined;
    endTime: Date | undefined;
    hasRepetitions: boolean;
    templateId: number;

    constructor(userOverviewEventModel: UserOverviewEventModel) {
        this.id = userOverviewEventModel.id;
        this.title = userOverviewEventModel.title;
        this.startTime = timeStringToDate(userOverviewEventModel.startTime);
        this.endTime = timeStringToDate(userOverviewEventModel.endTime);
        this.date = dateStringToDate(userOverviewEventModel.date);
        this.dateString = formatDate(this.date!);
        this.hasRepetitions = userOverviewEventModel.hasRepetitions;
        this.templateId = userOverviewEventModel.templateId;
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