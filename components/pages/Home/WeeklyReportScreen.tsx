import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {WihApiFocus} from "@/components/framework/wihApi/WihApiFocus";
import {WeeklyReport, WeeklyReportsResponse} from "@/constants/WihTypes/WeeklyReport";
import {Endpoints} from "@/constants/endpoints";
import WeeklyReportCard from "@/components/pages/Home/WeeklyReportCard";

export default function WeeklyReportScreen() {
    return (
        <WihApiFocus<WeeklyReportsResponse>
            endpoint={Endpoints.weeklyReport}
            method="GET"
            Component={({response, refresh}) => {
                const reports = response.map(r => new WeeklyReport(r));

                return (
                    <FlatList
                        data={reports}
                        keyExtractor={(r, idx) => r.User.id.toString() ?? idx.toString()}
                        renderItem={({item}) => (
                            <WeeklyReportCard report={item}/>
                        )}
                        contentContainerStyle={{padding: 16}}
                        ListHeaderComponent={<></>}
                        refreshControl={
                            <RefreshControl refreshing={false} onRefresh={refresh}/>
                        }
                    />
                );
            }}
        />
    );
}
