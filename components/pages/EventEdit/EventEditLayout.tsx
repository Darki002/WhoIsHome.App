import {WihResponse} from "@/helper/WihApi";
import {EventModelBase} from "@/constants/WihTypes/Event/BaseTypes";
import {PropsWithChildren, useCallback, useEffect} from "react";
import {useNavigation} from "expo-router";
import {usePermission} from "@/hooks/usePermission";
import WihView from "@/components/WihView";
import {WihText} from "@/components/WihText";
import {WihButton} from "@/components/input/WihButton";

interface EventEditLayoutProps {
    response: WihResponse<EventModelBase | null> | null;
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EventEditLayout({response, onCancel, onUpdate, children}: PropsWithChildren<EventEditLayoutProps>) {
    const navigation = useNavigation();
    const permissionCheck = usePermission();

    const onUpdatedChecked = useCallback(() => {
        const allowed = permissionCheck(response?.response?.userId);
        if(allowed){
            onUpdate();
        }
    }, [onUpdate, response]);

    useEffect(() => {
        if (!response) {
            navigation.setOptions({title: "Loading..."});
            return;
        }
        if (response.hasError) {
            navigation.setOptions({title: "Error"});
            return;
        }
        const title = response.response?.title ?? "Untitled Event";
        navigation.setOptions({title: `Edit: ${title}`});
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
        <WihView center="full">
            {children}

            {
                <WihView flex="row">
                    <WihButton onPress={onCancel}>Cancel</WihButton>
                    <WihButton onPress={onUpdatedChecked}>Update</WihButton>
                </WihView>
            }
        </WihView>
    )
}