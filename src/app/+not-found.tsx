import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import WihView from '@/components/WihView';
import WihLink from '@/components/WihLink';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <WihView style={styles.container}>
        <WihView>This screen doesn't exist.</WihView>
        <WihLink href="/" style={styles.link}>
          Go to home screen!
        </WihLink>
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
