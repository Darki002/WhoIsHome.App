import {RouteProp} from "@react-navigation/core";
import WihView from "@/components/WihView";
import {EventType} from "@/constants/WihTypes";
import React from "react";
import {eventViewComponentMap} from "@/components/EventScreen/ViewEventScreen";
import {eventEditComponentMap} from "@/components/EventScreen/EditEventScreen";

type EventRouteParams = {
    id: string;
    mode?: 'view' | 'edit';
    type: EventType;
};

interface EventScreenProps {
    route: RouteProp<{ eventScreen: EventRouteParams }, 'eventScreen'>;
}

export type EventComponent ={
    OneTime: ({id} : {id: string}) => React.JSX.Element;
    Repeated: ({id} : {id: string}) => React.JSX.Element;
}

const eventComponentMap : {view: EventComponent, edit: EventComponent} = {
    view: eventViewComponentMap,
    edit: eventEditComponentMap
}

export default function EventScreen({route}: EventScreenProps) {
    const {id, mode, type} = route.params;
    const viewMode = mode ?? "view";

    const EventComponent = eventComponentMap[viewMode][type];

    return (
        <WihView>
            <EventComponent id={id} />
        </WihView>
    );
}