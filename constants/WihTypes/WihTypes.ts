import {WihEvent, WihEventDto} from "@/constants/WihTypes/Event/WihEvent";

export type UserOverviewDto = {
    userId: number;
    today: WihEventDto[];
    thisWeek: WihEventDto[];
    futureEvents: WihEventDto[];
}

export class UserOverview {
    UserId: number;
    Today: WihEvent[];
    ThisWeek: WihEvent[];
    FutureEvents: WihEvent[];

    constructor(userOverviewDto: UserOverviewDto) {
        this.UserId = userOverviewDto.userId;
        this.Today = userOverviewDto.today.map(e => new WihEvent(e))
        this.ThisWeek = userOverviewDto.thisWeek.map(e => new WihEvent(e))
        this.FutureEvents = userOverviewDto.futureEvents.map(e => new WihEvent(e))
    }
}