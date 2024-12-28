import {useNavigation} from "expo-router";
import {PropsWithChildren, useEffect} from "react";
import {EventModelBase} from "@/constants/WihTypes";
import {WihResponse} from "@/helper/WihApi";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {WihButton} from "@/components/input/WihButton";
import {usePermission} from "@/hooks/usePermission";

interface EventViewLayoutProps {
    response: WihResponse<EventModelBase | null> | null;
    onEdit: () => void;
}

export default function EventViewLayout({response, onEdit, children}: PropsWithChildren<EventViewLayoutProps>) {
    const navigation = useNavigation();
    const permissionCheck = usePermission();

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

            {
                permissionCheck(response.response?.UserId) ? (
                    <WihView flex="row">
                        <WihButton onPress={onEdit}>Edit</WihButton>
                    </WihView>
                ) : <></>
            }

        </WihView>
    )
}