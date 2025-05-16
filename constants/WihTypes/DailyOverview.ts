import {timeStringToDate} from "@/helper/datetimehelper";
import {SimpleUser} from "@/constants/WihTypes/User";

export interface DailyOverviewDto {
    user: SimpleUser;
    isAtHome: boolean;
    dinnerTime: string | null;
}

export class DailyOverview {
    User: SimpleUser;
    IsAtHome: boolean;
    DinnerTime: Date | null;

    constructor(dailyOverviewDto : DailyOverviewDto) {
        this.User = dailyOverviewDto.user;
        this.IsAtHome = dailyOverviewDto.isAtHome;
        this.DinnerTime = timeStringToDate(dailyOverviewDto.dinnerTime ?? undefined) ?? null;
    }
}