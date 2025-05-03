import {SimpleUser} from "@/constants/WihTypes/User";
import {dateStringToDate, timeStringToDate} from "@/helper/datetimehelper";

export interface DailyOverviewItem {
    date: string;
    isAtHome: boolean;
    dinnerTime: string | null;
}

export interface WeeklyReportDto {
    user: SimpleUser;
    dailyOverviews: DailyOverviewItem[];
}

export type WeeklyReportsResponse = WeeklyReportDto[];

export class WeeklyReport {
    User: SimpleUser;
    DailyOverviews: WeeklyReportDailyOverview[];

    constructor(weeklyReportDto: WeeklyReportDto) {
        this.User = weeklyReportDto.user;
        this.DailyOverviews = weeklyReportDto.dailyOverviews.map(d => new WeeklyReportDailyOverview(d));
    }
}

export class WeeklyReportDailyOverview {
    Date: Date;
    IsAtHome: boolean;
    DinnerTime: Date | null;

    constructor(weeklyReportDailyOverviewDto: DailyOverviewItem) {
        this.Date = dateStringToDate(weeklyReportDailyOverviewDto.date)!;
        this.IsAtHome = weeklyReportDailyOverviewDto.isAtHome;
        this.DinnerTime = timeStringToDate(weeklyReportDailyOverviewDto.dinnerTime ?? undefined) ?? null;
    }
}