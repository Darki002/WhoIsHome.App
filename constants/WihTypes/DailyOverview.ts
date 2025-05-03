import {timeStringToDate} from "@/helper/datetimehelper";

export type DailyOverviewUser = {
    id: number;
    username: string;
}

export interface DailyOverviewDto {
    user: DailyOverviewUser;
    isAtHome: boolean;
    dinnerTime: string | null;
}

export class DailyOverview {
    User: DailyOverviewUser;
    IsAtHome: boolean;
    DinnerTime: Date | null;

    constructor(dailyOverviewDto : DailyOverviewDto) {
        this.User = dailyOverviewDto.user;
        this.IsAtHome = dailyOverviewDto.isAtHome;
        this.DinnerTime = timeStringToDate(dailyOverviewDto.dinnerTime ?? undefined) ?? null;
    }
}