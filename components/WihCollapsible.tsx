import Ionicons from '@expo/vector-icons/Ionicons';
import {PropsWithChildren, useState} from 'react';
import {StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';

import {WihText} from '@/components/WihText';
import WihView from '@/components/WihView';
import {Colors} from '@/constants/Colors';
import {useWihTheme} from "@/components/appContexts/WihThemeProvider";

export function WihCollapsible({children, title, isDefaultOpen = true}: PropsWithChildren & { title: string, isDefaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(isDefaultOpen);
    const theme = useWihTheme();

    return (
        <WihView>
            <TouchableOpacity
                style={[styles.heading, { backgroundColor: theme.background }]}
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}>
                <Ionicons
                    name={isOpen ? 'chevron-down' : 'chevron-forward-outline'}
                    size={18}
                    color={theme.icon}
                />
                <WihText style={styles.title}>{title}</WihText>
            </TouchableOpacity>
            {isOpen && <WihView style={styles.content}>{children}</WihView>}
        </WihView>
    );
}

const styles = StyleSheet.create({
    heading: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    content: {
        marginTop: 6,
        marginLeft: 24,
    },
});
