const Labels = {
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
        delete: "Actions.Delete",
        viewGroup: "Actions.ViewGroup",
        editGroup: "Actions.EditGroup"
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
            updateEvent: "Toast.Success.UpdateEvent",
            eventCreated: "Toast.Success.EventCreated"
        },
        error: {
            updateEvent: "Toast.Error.UpdateEvent",
            eventCreated: "Toast.Error.EventCreated",
            fixValidationError: "Toast.Error.FixValidationError"
        }
    },
    message: {
        viewInstance: "Message.ViewInstance",
        editInstance: "Message.EditInstance"
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
            startTime: "Errors.Validation.StartTime",
            endTime: "Errors.Validation.EndTime",
            date: "Errors.Validation.Date",
            startDate: "Errors.Validation.StartDate",
            endDate: "Errors.Validation.EndDate",
            weekdays: "Errors.Validation.Weekdays",
            presenceType: {
                late: "Errors.Validation.PresenceType.Late",
                other: "Errors.Validation.PresenceType.Other"
            },
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