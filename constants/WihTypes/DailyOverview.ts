import {SimpleUser} from "@/constants/WihTypes/User";

export interface DailyOverview {
    isAtHome: boolean;
    dinnerTime: string | null;  // "HH:mm:ss" or null
}

export type DailyOverviews = Record<string, DailyOverview>;

export interface WeeklyReport {
    user: SimpleUser;
    dailyOverviews: DailyOverviews;
}