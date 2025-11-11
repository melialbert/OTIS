import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Colors } from '@/constants/Colors';
import { MODULES } from '@/constants/Modules';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { WeeklyPlan } from '@/components/modules/WeeklyPlan';
import { LessonCard } from '@/components/modules/LessonCard';

export default function ModuleDetailScreen() {
    const { moduleId } = useLocalSearchParams();
    const router = useRouter();
    const { user, updateUser } = useUser();
    const { progress, updateProgress } = useProgress();
    const [selectedWeek, setSelectedWeek] = useState(1);

    const module = MODULES.find((m) => m.id === moduleId);
    const moduleProgress = progress[moduleId as string];

    if (!module || !user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <Text>Chargement...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isStarted = !!moduleProgress;
    const completionPercentage = moduleProgress?.completionPercentage || 0;
    const currentWeek = moduleProgress?.currentWeek || 1;
    const earnedXP = moduleProgress?.earnedXP || 0;

    const handleStartModule = () => {
        Alert.alert(
            'Démarrer le module',
            `Êtes-vous prêt à commencer "${module.title}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Démarrer',
                    onPress: () => {
                        updateProgress(module.id, {
                            moduleId: module.id,
                            currentWeek: 1,
                            currentDay: 1,
                            completedActivities: [],
                            earnedXP: 0,
                            earnedBadges: [],
                            startedAt: new Date().toISOString(),
                            lastAccessedAt: new Date().toISOString(),
                            completionPercentage: 0,
                        });
                        updateUser({ currentModule: module.id });
                        Alert.alert('Succès', 'Module démarré ! Bonne chance 🎉');
                    },
                },
            ]
        );
    };

    const selectedWeekData = module.weeks.find((w) => w.weekNumber === selectedWeek);

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: module.title,
                    headerStyle: { backgroundColor: module.color },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: '700' },
                }}
            />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header du module */}
                    <LinearGradient
                        colors={[module.color, module.color + '90']}
                        style={styles.moduleHeader}
                    >
                        <Text style={styles.moduleIcon}>{module.icon}</Text>
                        <Text style={styles.moduleTitle}>{module.title}</Text>
                        <Text style={styles.moduleDescription}>{module.description}</Text>

                        <View style={styles.moduleStats}>
                            <View style={styles.moduleStat}>
                                <Text style={styles.moduleStatValue}>⏱️ {module.duration}</Text>
                            </View>
                            <View style={styles.moduleStat}>
                                <Text style={styles.moduleStatValue}>⭐ {module.totalXP} XP</Text>
                            </View>
                            <View style={styles.moduleStat}>
                                <Text style={styles.moduleStatValue}>{module.badge}</Text>
                            </View>
                        </View>

                        {isStarted && (
                            <View style={styles.progressSection}>
                                <View style={styles.progressHeader}>
                                    <Text style={styles.progressLabel}>
                                        {earnedXP} / {module.totalXP} XP
                                    </Text>
                                    <Text style={styles.progressPercentage}>
                                        {Math.round(completionPercentage)}%
                                    </Text>
                                </View>
                                <ProgressBar progress={completionPercentage} color="#fff" />
                            </View>
                        )}
                    </LinearGradient>

                    {/* Bouton démarrer ou continuer */}
                    <View style={styles.actionSection}>
                        {!isStarted ? (
                            <Button
                                title="🚀 Démarrer le module"
                                onPress={handleStartModule}
                                size="large"
                            />
                        ) : (
                            <Button
                                title="▶️ Continuer le module"
                                onPress={() => {
                                    // Naviguer vers la prochaine leçon
                                    const currentWeekData = module.weeks[currentWeek - 1];
                                    if (currentWeekData && currentWeekData.days.length > 0) {
                                        const firstActivity = currentWeekData.days[0].activities[0];
                                        if (firstActivity) {
                                            router.push(`/modules/lesson/${firstActivity.id}`);
                                        }
                                    }
                                }}
                                size="large"
                            />
                        )}
                    </View>

                    {/* Informations du module */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 Informations</Text>
                        <Card>
                            <View style={styles.infoRow}>
                                <Ionicons name="calendar-outline" size={20} color={Colors.text} />
                                <Text style={styles.infoLabel}>Dates</Text>
                                <Text style={styles.infoValue}>
                                    {new Date(module.startDate).toLocaleDateString('fr-FR')} -{' '}
                                    {new Date(module.endDate).toLocaleDateString('fr-FR')}
                                </Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <Ionicons name="bar-chart-outline" size={20} color={Colors.text} />
                                <Text style={styles.infoLabel}>Niveau</Text>
                                <Badge
                                    label={
                                        module.level === 'beginner'
                                            ? 'Débutant'
                                            : module.level === 'intermediate'
                                                ? 'Intermédiaire'
                                                : 'Avancé'
                                    }
                                    variant="info"
                                />
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <Ionicons name="layers-outline" size={20} color={Colors.text} />
                                <Text style={styles.infoLabel}>Semaines</Text>
                                <Text style={styles.infoValue}>{module.weeks.length} semaines</Text>
                            </View>
                        </Card>
                    </View>

                    {/* Sélecteur de semaine */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📅 Semaines</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.weekSelector}
                        >
                            {module.weeks.map((week) => (
                                <TouchableOpacity
                                    key={week.weekNumber}
                                    style={[
                                        styles.weekButton,
                                        selectedWeek === week.weekNumber && styles.weekButtonActive,
                                        { borderColor: module.color },
                                    ]}
                                    onPress={() => setSelectedWeek(week.weekNumber)}
                                >
                                    <Text
                                        style={[
                                            styles.weekButtonText,
                                            selectedWeek === week.weekNumber && styles.weekButtonTextActive,
                                        ]}
                                    >
                                        Semaine {week.weekNumber}
                                    </Text>
                                    {currentWeek === week.weekNumber && isStarted && (
                                        <View
                                            style={[styles.currentWeekBadge, { backgroundColor: module.color }]}
                                        >
                                            <Text style={styles.currentWeekBadgeText}>En cours</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Plan de la semaine sélectionnée */}
                    {selectedWeekData && (
                        <View style={styles.section}>
                            <WeeklyPlan
                                week={selectedWeekData}
                                currentDay={moduleProgress?.currentDay}
                            />
                        </View>
                    )}

                    {/* Activités de la semaine */}
                    {selectedWeekData && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📚 Activités</Text>
                            {selectedWeekData.days.map((day) => (
                                <View key={day.dayNumber} style={styles.daySection}>
                                    <Text style={styles.dayTitle}>
                                        Jour {day.dayNumber} - {day.title}
                                    </Text>
                                    <View style={styles.activitiesList}>
                                        {day.activities.map((activity) => {
                                            const isCompleted = moduleProgress?.completedActivities.includes(
                                                activity.id
                                            );
                                            return (
                                                <LessonCard
                                                    key={activity.id}
                                                    activity={activity}
                                                    completed={isCompleted}
                                                    onPress={() => {
                                                        router.push(`/modules/lesson/${activity.id}`);
                                                    }}
                                                />
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Projet final */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎯 Projet Final</Text>
                        <Card style={[styles.projectCard, { borderColor: module.color }]}>
                            <Text style={styles.projectTitle}>{module.finalProject.title}</Text>
                            <Text style={styles.projectDescription}>
                                {module.finalProject.description}
                            </Text>

                            <View style={styles.projectInfo}>
                                <View style={styles.projectInfoItem}>
                                    <Ionicons name="star-outline" size={16} color={Colors.textSecondary} />
                                    <Text style={styles.projectInfoText}>
                                        {module.finalProject.maxPoints} points
                                    </Text>
                                </View>
                                <View style={styles.projectInfoItem}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={16}
                                        color={Colors.textSecondary}
                                    />
                                    <Text style={styles.projectInfoText}>
                                        {new Date(module.finalProject.deadline).toLocaleDateString('fr-FR')}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.projectRequirementsTitle}>Exigences :</Text>
                            {module.finalProject.requirements.map((req, index) => (
                                <View key={index} style={styles.projectRequirement}>
                                    <Text style={styles.projectRequirementBullet}>•</Text>
                                    <Text style={styles.projectRequirementText}>{req}</Text>
                                </View>
                            ))}

                            <Button
                                title="Voir les détails"
                                onPress={() => {
                                    Alert.alert(
                                        module.finalProject.title,
                                        'Détails complets du projet final à venir'
                                    );
                                }}
                                variant="outline"
                                size="medium"
                            />
                        </Card>
                    </View>

                    {/* Critères d'évaluation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📊 Critères d'évaluation</Text>
                        {module.finalProject.criteria.map((criterion, index) => (
                            <Card key={index} style={styles.criterionCard}>
                                <View style={styles.criterionHeader}>
                                    <Text style={styles.criterionName}>{criterion.name}</Text>
                                    <Text style={[styles.criterionPoints, { color: module.color }]}>
                                        {criterion.points} pts
                                    </Text>
                                </View>
                                <Text style={styles.criterionDescription}>{criterion.description}</Text>
                            </Card>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
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
    moduleHeader: {
        padding: 24,
        paddingTop: 32,
        gap: 12,
    },
    moduleIcon: {
        fontSize: 64,
        textAlign: 'center',
    },
    moduleTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    moduleDescription: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
        lineHeight: 20,
    },
    moduleStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
    },
    moduleStat: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    moduleStatValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    progressSection: {
        marginTop: 20,
        gap: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    actionSection: {
        padding: 16,
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    infoLabel: {
        flex: 1,
        fontSize: 14,
        color: Colors.text,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
    },
    weekSelector: {
        gap: 12,
        paddingRight: 16,
    },
    weekButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: '#fff',
        minWidth: 120,
        position: 'relative',
    },
    weekButtonActive: {
        backgroundColor: Colors.primary + '20',
    },
    weekButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    weekButtonTextActive: {
        color: Colors.primary,
    },
    currentWeekBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    currentWeekBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
    },
    daySection: {
        marginBottom: 20,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    activitiesList: {
        gap: 8,
    },
    projectCard: {
        borderWidth: 2,
        gap: 16,
    },
    projectTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },
    projectDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    projectInfo: {
        flexDirection: 'row',
        gap: 16,
    },
    projectInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    projectInfoText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    projectRequirementsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 8,
    },
    projectRequirement: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    projectRequirementBullet: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    projectRequirementText: {
        flex: 1,
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    criterionCard: {
        marginBottom: 8,
    },
    criterionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    criterionName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    criterionPoints: {
        fontSize: 16,
        fontWeight: '700',
    },
    criterionDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
});