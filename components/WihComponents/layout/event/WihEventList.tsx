import WihEventCard from "@/components/WihComponents/layout/event/WihEventCard";
import {UserOverviewEvent} from "@/constants/WihTypes/OverviewTypes";

export type WihEventListProps = {
    events: UserOverviewEvent[] | null | undefined;
}

export default function WihEventList({events}: WihEventListProps) {
    if (!events || events.length <= 0) {
        return null;
    }

    return (
        <>
            {events.map((event, i) => (<WihEventCard key={i} event={event}/>))}
        </>
    );
}