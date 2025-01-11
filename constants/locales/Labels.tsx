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
    sections: {
        today: "Sections.Today",
        thisWeek: "Sections.ThisWeek",
        other: "Sections.Other"
    },
    tabs: {
        home: "Tabs.Home",
        create: "Tabs.Create",
        profile: "Tabs.Profile",
        login: "Tabs.Login",
        register: "Tabs.Register",
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
        title: "Placeholders.Title",
        userName: "Placeholders.UserName",
        email: "Placeholders.Email",
        password: "Placeholders.Password",
        selectDate: "Placeholders.SelectDate",
        selectTime: "Placeholders.SelectTime"
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
    },
    other: {
        unknownTime: "Other.UnknownTime"
    }
} as const;

export default Labels;