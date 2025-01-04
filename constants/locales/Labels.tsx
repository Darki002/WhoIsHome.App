const Labels = {
    oneTimeEvent: "OneTimeEvent",
    repeatedEvent: "RepeatedEvent",
    titles: {
        login: "Titles.Login",
        register: "Titles.Register",
        appConfig: "Titles.AppConfig",
        eventCreator: "Titles.EventCreator",
        summary: "Titles.Summary"
    },
    actions: {
        login: "Actions.Login",
        register: "Actions.Register",
        save: "Actions.Save"
    },
    placeholders: {
        baseUri: "Placeholders.BaseUri",
        apikey: "Placeholders.ApiKey"
    },
    errors:{
        missingEmail: "Errors.MissingEmail",
        missingPassword: "Errors.MissingPassword",
        missingUsername: "Errors.MissingUsername",
        missingBaseUri: "Errors.MissingBaseUri",
        missingApiKey: "Errors.MissingApiKey"
    }
} as const;

export default Labels;