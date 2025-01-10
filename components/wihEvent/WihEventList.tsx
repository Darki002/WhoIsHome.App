import {WihText, WihTitle} from "@/components/WihText";
import WihEventCard from "@/components/wihEvent/WihEventCard";
import {WihEvent} from "@/constants/WihTypes/Event/WihEvent";

export type WihEventListProps = {
    events: WihEvent[] | null | undefined;
    title: string | null;
}

export default function WihEventList({events, title = null}: WihEventListProps) {
    if (!events) {
        return null;
    }

    if (title && events.length <= 0) {
        return (
            <>
                {title ? <WihTitle>{title}</WihTitle> : null}
                <WihText>Empty</WihText>
            </>
        )
    }

    return (
        <>
            {title ? <WihTitle>{title}</WihTitle> : null}
            {events.map((event, i) => (<WihEventCard key={i} event={event}/>))}
        </>
    );
}