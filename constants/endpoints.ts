import {formatDate} from "@/helper/datetimehelper";

export const Endpoints = {
    auth: {
        register: "auth/register",
        login: "auth/login",
        refresh: "auth/refresh",
        logout: "auth/logout"
    },
    user: {
        me: "user",
        withId: (id: number | string) => `user/${id}`
    },
    eventGroup: {
        url: "event-group",
        withId: (id: number | string) => `${Endpoints.eventGroup.url}/${id}`,
        instance: {
            with: EventInstanceQueryParams,
            withDate: (id: number | string, date: Date) => `${Endpoints.eventGroup.url}/${id}/instance/${date.toISOString()}`,
        }
    },
    quarries: {
        dailyOverview: "quarries/daily-overview",
        weeklyReport: "quarries/weekly-report",
        userOverview: {
            url: "quarries/user-overview",
            withId: (id: number | string) => `${Endpoints.quarries.userOverview.url}/${id}`
        },
    },
    pushUp: "push-up-settings",
} as const;

function EventInstanceQueryParams(id: number | string, start: Date | null, weeks: number | null) {
    let url = `${Endpoints.eventGroup.url}/${id}/instance/`;

    if(start != null){
        url += `?start=${encodeURIComponent(formatDate(start))}`;
    }

    if(weeks != null){
        const separator = start != null ? "&" : "?";
        url += `${separator}weeks=${encodeURIComponent(weeks.toString())}`;
    }

    return url;
}