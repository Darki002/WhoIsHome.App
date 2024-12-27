import {useNavigation} from "expo-router";
import {PropsWithChildren, useEffect} from "react";
import {EventBase} from "@/constants/WihTypes";
import {WihResponse} from "@/components/api/WihApi";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {WihButton} from "@/components/WihButton";

interface EventViewLayoutProps {
    response: WihResponse<EventBase | null> | null;
    onEdit: () => void;
}

export default function EventViewLayout({response, onEdit, children}: PropsWithChildren<EventViewLayoutProps>) {
    const navigation = useNavigation();

    useEffect(() => {
        if (!response) {
            navigation.setOptions({title: "Loading..."});
            return;
        }
        if (response.hasError) {
            navigation.setOptions({title: "Error"});
            return;
        }
        navigation.setOptions({title: response.response?.Title});
    }, [response]);

    if (!response) {
        return null;
    }

    if (response.hasError) {
        return (
            <WihView center="full">
                <WihText>Oops ERROR!!!</WihText>
            </WihView>
        )
    }

    return (
        <WihView>
            {children}

            <WihView flex="row">
                <WihButton onPress={onEdit} >Edit</WihButton>
            </WihView>
        </WihView>
    )
}