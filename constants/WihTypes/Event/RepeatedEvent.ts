import {EventBase, EventDtoBase, EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";
import {dateStringToDate} from "@/helper/datetimehelper";

export interface RepeatedEventModel extends EventModelBase {
    firstOccurrence?: Date;
    lastOccurrence?: Date | null;
}

export interface RepeatedEventDto extends EventDtoBase{
    FirstOccurrence?: string;
    LastOccurrence?: string | null;
}

export class RepeatedEvent extends EventBase {
    FirstOccurrence?: Date;
    LastOccurrence?: Date | null;

    constructor(repeatedEventModel?: RepeatedEventModel) {
        super(repeatedEventModel);

        if(!repeatedEventModel){
            return;
        }

        this.FirstOccurrence = dateStringToDate(repeatedEventModel.firstOccurrence);
        this.LastOccurrence = repeatedEventModel.lastOccurrence
            ? dateStringToDate(repeatedEventModel.lastOccurrence)
            : null;
    }
}