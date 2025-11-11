import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { LevelIndicator } from '@/components/gamification/LevelIndicator';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const { user, updateUser } = useUser();

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <Text>Chargement...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleResetProgress = () => {
        Alert.alert(
            'Réinitialiser la progression',
            'Êtes-vous sûr de vouloir réinitialiser toute votre progression ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Réinitialiser',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert('Succès', 'Progression réinitialisée. Redémarrez l\'app.');
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de réinitialiser');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header profil */}
                <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.profileHeader}
                >
                    <LevelIndicator level={user.level} size={80} />
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user.totalXP}</Text>
                            <Text style={styles.statLabel}>XP Total</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user.badges.length}</Text>
                            <Text style={styles.statLabel}>Badges</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user.completedModules.length}</Text>
                            <Text style={styles.statLabel}>Modules</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Informations du compte */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Compte</Text>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="person-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Modifier le profil</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="mail-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Changer l'email</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="lock-closed-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Mot de passe</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                </View>

                {/* Préférences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Préférences</Text>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Notifications</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="language-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Langue</Text>
                            <Text style={styles.menuItemValue}>Français</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="moon-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Thème</Text>
                            <Text style={styles.menuItemValue}>Clair</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="help-circle-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Aide & FAQ</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="chatbubbles-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Contactez-nous</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.menuItem}>
                            <Ionicons name="document-text-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuItemText}>Conditions d'utilisation</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                        </View>
                    </Card>
                </View>

                {/* Danger zone */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Données</Text>
                    <TouchableOpacity onPress={handleResetProgress}>
                        <Card style={styles.dangerCard}>
                            <View style={styles.menuItem}>
                                <Ionicons name="refresh-outline" size={24} color={Colors.error} />
                                <Text style={[styles.menuItemText, styles.dangerText]}>
                                    Réinitialiser la progression
                                </Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>OTIS v1.0.0</Text>
                    <Text style={styles.versionSubtext}>
                        Membre depuis {new Date(user.joinedDate).toLocaleDateString('fr-FR', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 32,
    },
    profileHeader: {
        padding: 32,
        alignItems: 'center',
        gap: 12,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginTop: 8,
    },
    userEmail: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 32,
        marginTop: 16,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.8,
        marginTop: 4,
    },
    section: {
        padding: 16,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    menuItemValue: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    dangerCard: {
        borderWidth: 1,
        borderColor: Colors.error + '30',
    },
    dangerText: {
        color: Colors.error,
    },
    versionContainer: {
        padding: 32,
        alignItems: 'center',
        gap: 4,
    },
    versionText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    versionSubtext: {
        fontSize: 11,
        color: Colors.textLight,
    },
});