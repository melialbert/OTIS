import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Colors } from '@/constants/Colors';
import { MODULES } from '@/constants/Modules';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RadarChart } from '@/components/ui/RadarChart';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProgressScreen() {
    const { user } = useUser();
    const { progress } = useProgress();

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <Text>Chargement...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const totalActivitiesCompleted = Object.values(progress).reduce(
        (sum, p) => sum + p.completedActivities.length,
        0
    );

    const totalXPEarned = Object.values(progress).reduce(
        (sum, p) => sum + p.earnedXP,
        0
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header avec niveau */}
                <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.levelCard}
                >
                    <Text style={styles.levelLabel}>Niveau actuel</Text>
                    <Text style={styles.levelNumber}>{user.level}</Text>
                    <Text style={styles.levelXP}>
                        {user.currentXP} / {user.xpToNextLevel} XP
                    </Text>
                    <View style={styles.levelProgressBar}>
                        <View
                            style={[
                                styles.levelProgressFill,
                                { width: `${(user.currentXP / user.xpToNextLevel) * 100}%` },
                            ]}
                        />
                    </View>
                </LinearGradient>

                {/* Stats rapides */}
                <View style={styles.statsContainer}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statEmoji}>🎯</Text>
                        <Text style={styles.statValue}>{totalActivitiesCompleted}</Text>
                        <Text style={styles.statLabel}>Activités complétées</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statEmoji}>⭐</Text>
                        <Text style={styles.statValue}>{totalXPEarned}</Text>
                        <Text style={styles.statLabel}>XP gagnés</Text>
                    </Card>
                </View>

                {/* Graphique de compétences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Compétences</Text>
                    <Card style={styles.radarCard}>
                        <RadarChart
                            data={user.skills.map(skill => ({
                                name: skill.name,
                                value: skill.level,
                                maxValue: skill.maxLevel,
                            }))}
                            size={250}
                        />
                    </Card>
                </View>

                {/* Progression par module */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📚 Modules</Text>
                    {MODULES.map((module) => {
                        const moduleProgress = progress[module.id];
                        const completionPercentage = moduleProgress?.completionPercentage || 0;
                        const earnedXP = moduleProgress?.earnedXP || 0;

                        return (
                            <Card key={module.id} style={styles.moduleProgressCard}>
                                <View style={styles.moduleProgressHeader}>
                                    <Text style={styles.moduleIcon}>{module.icon}</Text>
                                    <View style={styles.moduleProgressInfo}>
                                        <Text style={styles.moduleTitle}>{module.title}</Text>
                                        <Text style={styles.moduleXP}>
                                            {earnedXP} / {module.totalXP} XP
                                        </Text>
                                    </View>
                                </View>
                                <ProgressBar
                                    progress={completionPercentage}
                                    color={module.color}
                                    showLabel
                                />
                            </Card>
                        );
                    })}
                </View>

                {/* Badges */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏆 Badges ({user.badges.length})</Text>
                    {user.badges.length > 0 ? (
                        <View style={styles.badgesGrid}>
                            {user.badges.map((badge) => (
                                <Card key={badge.id} style={styles.badgeCard}>
                                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                    <Text style={styles.badgeName} numberOfLines={2}>
                                        {badge.name}
                                    </Text>
                                    <Text style={styles.badgeDate}>
                                        {new Date(badge.unlockedAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </Text>
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <Card style={styles.emptyBadges}>
                            <Text style={styles.emptyBadgesIcon}>🎯</Text>
                            <Text style={styles.emptyBadgesText}>
                                Complète des activités pour débloquer tes premiers badges !
                            </Text>
                        </Card>
                    )}
                </View>

                {/* Calendrier d'activité (placeholder) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📅 Activité récente</Text>
                    <Card style={styles.calendarCard}>
                        <Text style={styles.calendarPlaceholder}>
                            Calendrier d'activité - À venir
                        </Text>
                    </Card>
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
    levelCard: {
        margin: 16,
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        gap: 8,
    },
    levelLabel: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    levelNumber: {
        fontSize: 64,
        fontWeight: '700',
        color: '#fff',
    },
    levelXP: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        fontWeight: '600',
    },
    levelProgressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        marginTop: 8,
        overflow: 'hidden',
    },
    levelProgressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        gap: 8,
    },
    statEmoji: {
        fontSize: 32,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    section: {
        padding: 16,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },
    radarCard: {
        alignItems: 'center',
        padding: 24,
    },
    moduleProgressCard: {
        gap: 12,
        marginBottom: 12,
    },
    moduleProgressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    moduleIcon: {
        fontSize: 32,
    },
    moduleProgressInfo: {
        flex: 1,
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    moduleXP: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    badgeCard: {
        width: '30%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 4,
    },
    badgeIcon: {
        fontSize: 32,
    },
    badgeName: {
        fontSize: 10,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
    },
    badgeDate: {
        fontSize: 9,
        color: Colors.textSecondary,
    },
    emptyBadges: {
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    emptyBadgesIcon: {
        fontSize: 48,
    },
    emptyBadgesText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    calendarCard: {
        padding: 32,
        alignItems: 'center',
    },
    calendarPlaceholder: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});