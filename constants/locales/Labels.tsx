const Labels = {
    oneTimeEvent: "OneTimeEvent",
    repeatedEvent: "RepeatedEvent",
    presenceType: {
        unknown: "PresenceType.Unknown",
        late: "PresenceType.Late",
        notPresent: "PresenceType.NotPresent"
    },
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
        save: "Actions.Save",
        cancel: "Actions.Cancel",
        edit: "Actions.Edit",
        next: "Actions.Next",
        back: "Actions.Back",
        finish: "Actions.Finish"
    },
    placeholders: {
        baseUri: "Placeholders.BaseUri",
        apikey: "Placeholders.ApiKey",
        title: "Placeholders.Title"
    },
    toast: {
        success: {
            updateEvent: "Toast.Success.UpdateEvent"
        },
        error: {
            updateEvent: "Toast.Error.UpdateEvent"
        }
    },
    headers: {
        unknown: "Headers.Unknown",
        editing: "Headers.Editing"
    },
    errors: {
        header: "Errors.Header",
        generic: "Errors.Generic",
        missingEmail: "Errors.MissingEmail",
        missingPassword: "Errors.MissingPassword",
        missingUsername: "Errors.MissingUsername",
        missingBaseUri: "Errors.MissingBaseUri",
        missingApiKey: "Errors.MissingApiKey"
    }
} as const;

export default Labels;