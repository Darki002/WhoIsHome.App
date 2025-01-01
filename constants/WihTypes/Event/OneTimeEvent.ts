import {EventBase, EventDtoBase, EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";
import {dateStringToDate} from "@/helper/datetimehelper";

export interface OneTimeEventModel extends EventModelBase {
    date?: Date | string;
}

export interface OneTimeEventDto extends EventDtoBase{
    Date: string;
}

export class OneTimeEvent extends EventBase {
    Date?: Date;

    constructor(oneTimeEventModel : OneTimeEventModel) {
        super(oneTimeEventModel);
        this.Date = dateStringToDate(oneTimeEventModel.date);
    }
}