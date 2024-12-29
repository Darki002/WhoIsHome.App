import {EventBase, EventDtoBase, EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";

export interface OneTimeEvent extends EventBase {
    Date?: Date
}

export interface OneTimeEventModel extends EventModelBase {
    date?: Date
}

export interface OneTimeEventDto extends EventDtoBase{
    Date: string;
}