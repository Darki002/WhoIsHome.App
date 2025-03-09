import {ReactNode, useCallback, useState} from "react";
import useWihApi, {WihFetchProps} from "@/hooks/wihApi/useWihApi";
import {useFocusEffect} from "expo-router";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import {WihLoadingView} from "@/components/WihComponents/feedback/WihLoading";

export interface WihApiFocusProps<T> extends WihFetchProps {
    Children: (props: {response: T}) => ReactNode;
}

export function WihApiFocus<T extends any>({endpoint, method, version, Children} : WihApiFocusProps<T>) {
    const {data, error, isLoading, refresh} = useWihApiFocus<T>({endpoint, method, version});

    if(isLoading) {
        return <WihLoadingView />;
    }

    if(error){
        return <WihErrorView error={error} refresh={refresh} />
    }

    if(!data) {
        return <WihErrorView error={"(Focus API) There was no data present and no error!"} refresh={refresh} />
    }

    return <Children response={data} />
}

export default function useWihApiFocus<T>(props: WihFetchProps) {
    const [data, setData] = useState<T | null | undefined>();
    const [error, setError] = useState<string | Error | undefined | null>();
    const [isLoading, setIsLoading] = useState(false);

    const callApi = useWihApi<T>(props);

    const call = useCallback(() => {
        setIsLoading(true);

        callApi().then(response => {

            if(typeof response === "string"){
                setError(response);
            }
            else if(!response.isValid()) {
                setError(response.error ?? response?.getErrorMessage());
            }
            else {
                setData(response.data);
            }

            setIsLoading(false);
        });
    }, [callApi]);

    useFocusEffect(call);

    return {data, error, isLoading, refresh: call};
}