import {WihOption} from "@/components/WihComponents/input/WihRadioButton";
import Labels from "@/constants/locales/Labels";
import {PresenceType} from "@/constants/WihTypes/PresenceType";

export const weekDaysOptions: Array<WihOption<number>> = [
    {value: 1, displayTextLabel: Labels.weekdays.shortByNumber[1]},
    {value: 2, displayTextLabel: Labels.weekdays.shortByNumber[2]},
    {value: 3, displayTextLabel: Labels.weekdays.shortByNumber[3]},
    {value: 4, displayTextLabel: Labels.weekdays.shortByNumber[4]},
    {value: 5, displayTextLabel: Labels.weekdays.shortByNumber[5]},
    {value: 6, displayTextLabel: Labels.weekdays.shortByNumber[6]},
    {value: 0, displayTextLabel: Labels.weekdays.shortByNumber[0]}
]

export const presenceTypeOptions : Array<WihOption<PresenceType>> = [
    {value: PresenceType.Unknown, displayTextLabel: Labels.presenceType.unknown},
    {value: PresenceType.Late, displayTextLabel: Labels.presenceType.late},
    {value: PresenceType.NotPresent, displayTextLabel: Labels.presenceType.notPresent}
];