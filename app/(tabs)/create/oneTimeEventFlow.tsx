import {useWihFlow, WihFlowComponent} from "@/hooks/useWihFlow";
import {WihTitle} from "@/components/WihText";
import {Time} from "lightningcss";
import {useRouter} from "expo-router";

interface OneTimeEvent {
    Title?: string;
    Date?: Date;
    StateTime?: Time;
    EndTime?: Time;
    // TODO: what else needs the API?
}

export default function OneTimeEventFlow() {
    const router = useRouter();
    const [state, flow] = useWihFlow<OneTimeEvent>({
        initValue: {},
        onFinish,
        onCancel,
        components: [firstStep]
    });

    function onFinish(){
        // TODO: show overview, don't route, should be able to go back and edit again
    }

    function onCancel() {
        router.replace("/(tabs)/create");
    }

    if(!flow) {
        return <WihTitle>Oops, Error</WihTitle>
    }

    return flow;
}

function firstStep({} : WihFlowComponent<OneTimeEvent>){
    return <></>
}