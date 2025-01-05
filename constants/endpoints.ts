export const Endpoints = {
    auth: {
        register: "Auth/Register"
    },
    user: {
        me: "User/Me"
    },
    oneTimeEvent: "OneTimeEvent",
    repeatedEvent: "RepeatedEvent",
    dailyOverview: "DailyOverview",
    userOverview: "UserOverview"
} as const;

type EndpointValues<T> = T extends object
    ? { [K in keyof T]: EndpointValues<T[K]> }[keyof T]
    : T;

export type EndpointProp = EndpointValues<typeof Endpoints>;
