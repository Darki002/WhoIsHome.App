import {ReactNode, useCallback, useState} from "react";
import useWihApi, {QueryParams, WihFetchProps} from "@/hooks/useWihApi";
import {useFocusEffect} from "expo-router";
import {WihErrorView} from "@/components/WihComponents/feedback/WihErrorView";
import {WihLoadingView} from "@/components/WihComponents/feedback/WihLoading";

export interface WihApiFocusComponentParams<T, TQuery extends QueryParams = QueryParams> {
    response: T;
    refresh: (queryParams?: TQuery) => void;
}

export interface WihApiFocusProps<T, TQuery extends QueryParams = QueryParams> extends WihFetchProps {
    defaultQueryParams?: TQuery;
    Component: (props: WihApiFocusComponentParams<T, TQuery>) => ReactNode;
}

export interface UseWihApiFocusProps<TQuery extends QueryParams> extends WihFetchProps {
    defaultQueryParams?: TQuery;
}

export function WihApiFocus<TResponse, TQuery extends QueryParams = QueryParams>({endpoint, method, version, Component} : WihApiFocusProps<TResponse, TQuery>) {
    const {data, error, isLoading, refresh} = useWihApiFocus<TResponse, TQuery>({endpoint, method, version});

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

export default function useWihApiFocus<TResponse, TQuery extends QueryParams = QueryParams>(props: UseWihApiFocusProps<TQuery>) {
    const [data, setData] = useState<TResponse | null | undefined>();
    const [error, setError] = useState<string | Error | undefined | null>();
    const [isLoading, setIsLoading] = useState(true);

    const callApi = useWihApi<never, TResponse, TQuery>(props);

    const call = useCallback((queryParams?: TQuery) => {
        setIsLoading(true);

        callApi(undefined, queryParams ?? props.defaultQueryParams).then(response => {
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