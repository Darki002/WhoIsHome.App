import {PropsWithChildren, useCallback, useState} from "react";
import WihView from "@/components/WihView";
import {RefreshControl, ScrollView, ScrollViewProps} from "react-native";

export interface WihRefreshableViewProps extends ScrollViewProps {
    onRefresh: () => Promise<void>;
}

export function WihRefreshableScrollView({children, onRefresh, ...rest}: PropsWithChildren<WihRefreshableViewProps>) {
    const [refreshing, setRefreshing] = useState(false);

    const onScrollRefresh = useCallback(async () => {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
    }, []);

    return (
        <WihView>
            <ScrollView
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onScrollRefresh}/>}
                {...rest}
            >
                {children}
            </ScrollView>
        </WihView>
    )
}