import {PropsWithChildren, useCallback, useState} from "react";
import WihView from "@/components/WihComponents/view/WihView";
import {RefreshControl, ScrollView, ScrollViewProps} from "react-native";

export interface WihRefreshableViewProps extends ScrollViewProps {
    onRefresh: () => void;
}

export function WihRefreshableScrollView({children, onRefresh, ...rest}: PropsWithChildren<WihRefreshableViewProps>) {
    const [refreshing, setRefreshing] = useState(false);

    const onScrollRefresh = useCallback(() => {
        setRefreshing(true);
        onRefresh();
        setRefreshing(false);
    }, [onRefresh]);

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