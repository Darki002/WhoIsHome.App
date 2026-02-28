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
            withId: (id: number | string) => `${Endpoints.eventGroup.url}/${id}/instance/`,
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