import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import { WihApiFocus } from '@/components/framework/wihApi/WihApiFocus';
import {DailyOverview, DailyOverviewDto} from "@/constants/WihTypes/DailyOverview";
import {Endpoints} from "@/constants/endpoints";
import {DailyOverviewCard} from "@/components/pages/Home/DailyOverviewCard";

export default function DailyOverviewScreen() {
    return (
        <WihApiFocus<DailyOverviewDto[]>
            endpoint={Endpoints.dailyOverview}
            method="GET"
            Component={({ response, refresh }) => {
                const overviews = response.map(r => new DailyOverview(r));

                return (
                    <FlatList
                        data={overviews}
                        keyExtractor={(d, idx) => d.User.id.toString() ?? idx.toString()}
                        renderItem={({ item }) => (
                            <DailyOverviewCard overview={item} />
                        )}
                        contentContainerStyle={{ padding: 16 }}
                        ListHeaderComponent={<></>}
                        refreshControl={
                            <RefreshControl refreshing={false} onRefresh={refresh} />
                        }
                    />
                );
            }}
        />
    );
}
