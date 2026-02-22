import {ReactNode, useCallback, useState} from "react";
import useWihApi, {WihFetchProps} from "@/hooks/useWihApi";
import {useFocusEffect} from "expo-router";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import {WihLoadingView} from "@/components/WihComponents/feedback/WihLoading";

export interface WihApiFocusComponentParams<T> {
    response: T;
    refresh: () => void;
}

export interface WihApiFocusProps<T> extends WihFetchProps {
    Component: (props: WihApiFocusComponentParams<T>) => ReactNode;
}

export function WihApiFocus<TResponse>({endpoint, method, version, Component} : WihApiFocusProps<TResponse>) {
    const {data, error, isLoading, refresh} = useWihApiFocus<TResponse>({endpoint, method, version});

    if(isLoading) {
        return <WihLoadingView />;
    }

    if(error){
        return <WihErrorView error={error} refresh={refresh} />
    }

    if(!data) {
        return <WihErrorView error={"(Focus API) There was no data present and no error!"} refresh={refresh} />
    }

    return <Component response={data} refresh={refresh} />
}

export default function useWihApiFocus<TResponse>(props: WihFetchProps) {
    const [data, setData] = useState<TResponse | null | undefined>();
    const [error, setError] = useState<string | Error | undefined | null>();
    const [isLoading, setIsLoading] = useState(true);

    const callApi = useWihApi<never, TResponse>(props);

    const call = useCallback(() => {
        setIsLoading(true);

        callApi().then(response => {
            setError(null);
            setData(null);
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

    useFocusEffect(useCallback(() => call(), []));

    return {data, error, isLoading, refresh: call};
}