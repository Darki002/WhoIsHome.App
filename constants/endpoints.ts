export const Endpoints = {
    auth: {
        register: "Auth/Register"
    },
    user: {
        me: "User/Me"
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
    userOverview: "UserOverview"
} as const;
