import {SimpleUser} from "@/constants/WihTypes/User";
import {timeStringToDate} from "@/helper/datetimehelper";

export type WeeklyReportDto = {
    user: SimpleUser;
    dailyOverviews: WeeklyReportDailyOverviewDto[];
}

export type WeeklyReportDailyOverviewDto = {
    isAtHome: boolean;
    dinnerTime: string | null;
}

export class WeeklyReport {
    User: SimpleUser;
    DailyOverviews: WeeklyReportDailyOverview[];

    constructor(weeklyReportDto: WeeklyReportDto) {
        this.User = weeklyReportDto.user;
        this.DailyOverviews = weeklyReportDto.dailyOverviews.map(d => new WeeklyReportDailyOverview(d));
    }
}

export class WeeklyReportDailyOverview {
    IsAtHome: boolean;
    DinnerTime: Date | null;

    constructor(weeklyReportDailyOverviewDto: WeeklyReportDailyOverviewDto) {
        this.IsAtHome = weeklyReportDailyOverviewDto.isAtHome;
        this.DinnerTime = timeStringToDate(weeklyReportDailyOverviewDto.dinnerTime ?? undefined) ?? null;
    }
}