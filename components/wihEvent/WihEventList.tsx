import WihEventCard from "@/components/wihEvent/WihEventCard";
import {WihEvent} from "@/constants/WihTypes/Event/WihEvent";

export type WihEventListProps = {
    events: WihEvent[] | null | undefined;
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