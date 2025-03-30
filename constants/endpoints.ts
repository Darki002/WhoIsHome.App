export const Endpoints = {
    auth: {
        register: "Auth/Register",
        login: "Auth/Login",
        refresh: "Auth/Refresh",
        logout: "Auth/Logout"
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
    },
    pushUp: "PushUp"
} as const;
