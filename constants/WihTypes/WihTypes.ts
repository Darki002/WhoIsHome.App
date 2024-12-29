import {WihEvent} from "@/constants/WihTypes/Event/BaseTypes";

export type UserOverview = {
    userId: number;
    today: WihEvent[];
    thisWeek: WihEvent[];
    futureEvents: WihEvent[];
}