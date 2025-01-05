const Labels = {
    oneTimeEvent: "OneTimeEvent",
    repeatedEvent: "RepeatedEvent",
    titles: {
        welcome: "Titles.Welcome",
        login: "Titles.Login",
        register: "Titles.Register",
        appConfig: "Titles.AppConfig",
        eventCreator: "Titles.EventCreator",
        summary: "Titles.Summary"
    },
    subTitles: {
        today: "SubTitles.Today",
        thisWeek: "SubTitles.ThisWeek",
        other: "SubTitles.Other"
    },
    actions: {
        login: "Actions.Login",
        logout: "Actions.Logout",
        register: "Actions.Register",
        save: "Actions.Save"
    },
    placeholders: {
        baseUri: "Placeholders.BaseUri",
        apikey: "Placeholders.ApiKey"
    },
    errors:{
        generic: "Errors.Generic",
        missingEmail: "Errors.MissingEmail",
        missingPassword: "Errors.MissingPassword",
        missingUsername: "Errors.MissingUsername",
        missingBaseUri: "Errors.MissingBaseUri",
        missingApiKey: "Errors.MissingApiKey"
    }
} as const;

export default Labels;