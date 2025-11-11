import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View style={styles.container}>
                <Text style={styles.title}>404</Text>
                <Text style={styles.subtitle}>Cette page n'existe pas</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>Retour à l'accueil</Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.surface,
    },
    title: {
        fontSize: 72,
        fontWeight: '700',
        color: Colors.primary,
    },
    subtitle: {
        fontSize: 20,
        marginTop: 8,
        color: Colors.textSecondary,
    },
    link: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    linkText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
    },
});