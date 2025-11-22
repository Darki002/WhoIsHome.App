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
        summary: "Titles.Summary",
        createFlow: {
            titleStep: "Titles.CreateFlow.TitleStep",
            dateStep: "Titles.CreateFlow.DateStep",
            dinnerTimeStep: "Titles.CreateFlow.DinnerTimeStep",
        }
    },
    sections: {
        today: "Sections.Today",
        thisWeek: "Sections.ThisWeek",
        other: "Sections.Other"
    },
    labels: {
        date: "Labels.Date",
        startTime: "Labels.StartTime",
        endTime: "Labels.EndTime",
        presenceType: "Labels.PresenceType",
        dinnerTime: "Labels.DinnerTime",
        startDate: "Labels.StartDate",
        endDate: "Labels.EndDate",
    },
    tabs: {
        home: "Tabs.Home",
        create: "Tabs.Create",
        profile: "Tabs.Profile",
        login: "Tabs.Login",
        register: "Tabs.Register",
        daily: "Tabs.Daily",
        weekly: "Tabs.Weekly",
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
        finish: "Actions.Finish",
        create: "Actions.Create",
        confirm: "Actions.Confirm",
        delete: "Actions.Delete"
    },
    placeholders: {
        baseUri: "Placeholders.BaseUri",
        apikey: "Placeholders.ApiKey",
        title: "Placeholders.Title",
        userName: "Placeholders.UserName",
        email: "Placeholders.Email",
        password: "Placeholders.Password",
        selectDate: "Placeholders.SelectDate",
        selectTime: "Placeholders.SelectTime",
        picker: "Placeholders.Picker"
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
        missingApiKey: "Errors.MissingApiKey",
        validation: {
            title: "Errors.Validation.Title",
            startTime: "Descriptions.Validation.StartTime",
            date: "Descriptions.Validation.Date",
            presenceType: "Descriptions.Validation.PresenceType",
            dinnerTime: "Descriptions.Validation.DinnerTime",
            firstOccurrence: "Titles.CreateFlow.FirstOccurrence",
        },
        noEvents: "Errors.NoEvents"
    },
    dailyOverviewCard: {
        unknownTime: "DailyOverviewCard.UnknownTime"
    },
    descriptions: {
        eventCreator: "Descriptions.EventCreator",
        oneTimeEvent: "Descriptions.OneTimeEvent",
        repeatedEvent: "Descriptions.RepeatedEvent",
        createFlow: {
            titleStep: "Descriptions.CreateFlow.TitleStep",
        }
    },
    dialog: {
        deleteTitle: "Dialog.DeleteTitle",
        deleteMessage: "Dialog.DeleteMessage"
    },
    weekdays: {
        shortByNumber: [
            "Weekdays.ShortByNumber.Sunday",
            "Weekdays.ShortByNumber.Monday",
            "Weekdays.ShortByNumber.Tuesday",
            "Weekdays.ShortByNumber.Wednesday",
            "Weekdays.ShortByNumber.Thursday",
            "Weekdays.ShortByNumber.Friday",
            "Weekdays.ShortByNumber.Saturday"
        ]
    }
} as const;

export default Labels;