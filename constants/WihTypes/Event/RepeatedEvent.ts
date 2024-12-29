import {EventBase, EventDtoBase, EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";

export interface RepeatedEvent extends EventBase {
    FirstOccurrence?: Date;
    LastOccurrence?: Date;
}

export interface RepeatedEventModel extends EventModelBase {
    firstOccurrence?: Date;
    lastOccurrence?: Date;
}

export interface RepeatedEventDto extends EventDtoBase{
    FirstOccurrence?: string;
    LastOccurrence?: string;
}