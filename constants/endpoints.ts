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
            withDate: (id: number | string, date: Date) => `${Endpoints.eventGroup.url}/${id}/instance/${date.toISOString()}`,
        }
    },
    quarries: {
        dailyOverview: "daily-overview",
        weeklyReport: "weekly-report",
        userOverview: {
            url: "user-overview",
            withId: (id: number | string) => `${Endpoints.quarries.userOverview.url}/${id}`
        },
    },
    pushUp: "push-up-settings",
} as const;
