export const Endpoints = {
    auth: {
        register: "Auth/Register"
    },
    user: {
        me: "User/Me",
        withId: (id: number | string) => `User/${id}`
    },
    oneTimeEvent: {
        url: "OneTimeEvent",
        withId: (id: number | string) => `${Endpoints.oneTimeEvent.url}/${id}`
    },
    repeatedEvent: {
        url: "RepeatedEvent",
        withId: (id: number | string) => `${Endpoints.repeatedEvent.url}/${id}`
    },
    dailyOverview: "DailyOverview",
    userOverview: {
        url: "UserOverview",
        withId: (id: number | string) => `${Endpoints.userOverview.url}/${id}`
    }
} as const;
