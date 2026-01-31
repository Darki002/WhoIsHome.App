import {dateStringToDate, formatDate, timeStringToDate} from "@/helper/datetimehelper";

export interface UserOverviewEventModel {
    groupId: number;
    title: string;
    date: Date | string;
    startTime: Date | string;
    endTime: Date | string;
    hasRepetitions: boolean;
}

export class UserOverviewEvent {
    GroupId: number;
    Title: string;
    Date: Date | undefined;
    DateString: string = undefined!;
    StartTime: Date | undefined;
    EndTime: Date | undefined;
    HasRepetitions: boolean;

    constructor(userOverviewEventModel: UserOverviewEventModel) {
        this.GroupId = userOverviewEventModel.groupId;
        this.Title = userOverviewEventModel.title;
        this.StartTime = timeStringToDate(userOverviewEventModel.startTime);
        this.EndTime = timeStringToDate(userOverviewEventModel.endTime);
        this.Date = dateStringToDate(userOverviewEventModel.date);
        this.DateString = formatDate(this.Date!);
        this.HasRepetitions = userOverviewEventModel.hasRepetitions;
    }
}

export type UserOverviewDto = {
    userId: number;
    events: UserOverviewEventModel[];
}

export class UserOverview {
    UserId: number;
    Events: UserOverviewEvent[];

    constructor(userOverviewDto: UserOverviewDto) {
        this.UserId = userOverviewDto.userId;
        this.Events = userOverviewDto.events.map(e => new UserOverviewEvent(e))
    }
}