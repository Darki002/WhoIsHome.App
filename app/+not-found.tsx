import {Link, Stack} from 'expo-router';
import {StyleSheet} from 'react-native';

import WihView from '@/components/WihComponents/view/WihView';
import {WihText} from "@/components/WihComponents/display/WihText";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{title: 'Oops!'}}/>
            <WihView style={styles.container}>
                <WihText>This screen doesn't exist.</WihText>
                <Link href="/(app)/(tabs)" style={styles.link}>
                    Go to home screen!
                </Link>
            </WihView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
