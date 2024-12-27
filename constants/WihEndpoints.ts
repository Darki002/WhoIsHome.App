import {EventType} from "@/constants/WihTypes";

export type EventEndpoints = "OneTimeEvent" | "RepeatedEvent";

export const fromEventType = (type : EventType) : EventEndpoints => {
    switch (type){
        case "OneTime":
            return "OneTimeEvent";
        case "Repeated":
            return "RepeatedEvent";
        default:
            throw new Error(`$Event of type ${type} does not have an endpoint`);
    }
}