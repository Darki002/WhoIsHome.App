import {EventBase, EventDtoBase, EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";
import {dateStringToDate} from "@/helper/datetimehelper";

export interface RepeatedEventModel extends EventModelBase {
    firstOccurrence?: Date;
    lastOccurrence?: Date;
}

export interface RepeatedEventDto extends EventDtoBase{
    FirstOccurrence?: string;
    LastOccurrence?: string;
}

export class RepeatedEvent extends EventBase {
    FirstOccurrence?: Date;
    LastOccurrence?: Date;

    constructor(repeatedEventModel?: RepeatedEventModel) {
        super(repeatedEventModel);

        if(!repeatedEventModel){
            return;
        }

        this.FirstOccurrence = dateStringToDate(repeatedEventModel.firstOccurrence);
        this.LastOccurrence = dateStringToDate(repeatedEventModel.lastOccurrence);
    }
}