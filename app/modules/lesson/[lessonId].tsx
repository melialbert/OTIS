import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
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
import { contentService } from '@/services/content';
import { Lesson, Quiz } from '@/types/content.types';
import { QuizComponent } from '@/components/quiz/QuizComponent';

export default function LessonDetailScreen() {
    const { lessonId } = useLocalSearchParams();
    const router = useRouter();
    const { user, addXP } = useUser();
    const { progress, completeActivity } = useProgress();
    const [isCompleting, setIsCompleting] = useState(false);
    const [lessonContent, setLessonContent] = useState<Lesson | null>(null);
    const [quizContent, setQuizContent] = useState<Quiz | null>(null);
    const [loadingContent, setLoadingContent] = useState(true);

    // Trouver l'activité dans tous les modules
    let foundActivity: any = null;
    let foundModule: any = null;

    for (const module of MODULES) {
        for (const week of module.weeks) {
            for (const day of week.days) {
                const activity = day.activities.find((a) => a.id === lessonId);
                if (activity) {
                    foundActivity = activity;
                    foundModule = module;
                    break;
                }
            }
            if (foundActivity) break;
        }
        if (foundActivity) break;
    }

    if (!foundActivity || !foundModule || !user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loading}>
                    <Text>Leçon introuvable</Text>
                </View>
            </SafeAreaView>
        );
    }

    const moduleProgress = progress[foundModule.id];
    const isCompleted = moduleProgress?.completedActivities.includes(foundActivity.id);

    useEffect(() => {
        loadContent();
    }, [lessonId]);

    const loadContent = async () => {
        if (!foundActivity || !lessonId) return;

        setLoadingContent(true);
        try {
            if (foundActivity.type === 'lecture' || foundActivity.type === 'video') {
                const lesson = await contentService.getLessonByActivityId(lessonId as string);
                setLessonContent(lesson);
            } else if (foundActivity.type === 'quiz') {
                const quiz = await contentService.getQuizByActivityId(lessonId as string);
                setQuizContent(quiz);
            }
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoadingContent(false);
        }
    };

    const handleQuizComplete = async (score: number, passed: boolean) => {
        if (passed && !isCompleted) {
            await completeActivity(foundModule.id, foundActivity.id, foundActivity.xp);
            await addXP(foundActivity.xp);
            Alert.alert(
                '🎉 Quiz réussi !',
                `Vous avez obtenu ${score}% !\n\n+${foundActivity.xp} XP`,
                [
                    {
                        text: 'Continuer',
                        onPress: () => router.back(),
                    },
                ]
            );
        }
    };

    const getActivityTypeInfo = () => {
        switch (foundActivity.type) {
            case 'lecture':
                return {
                    icon: '📖',
                    label: 'Cours théorique',
                    color: Colors.info,
                    description: 'Lisez attentivement le contenu et prenez des notes si nécessaire.',
                };
            case 'video':
                return {
                    icon: '🎥',
                    label: 'Vidéo interactive',
                    color: Colors.secondary,
                    description: 'Regardez la vidéo et interagissez avec le contenu.',
                };
            case 'quiz':
                return {
                    icon: '❓',
                    label: 'Quiz d\'évaluation',
                    color: Colors.warning,
                    description: 'Testez vos connaissances avec ce quiz.',
                };
            case 'exercise':
                return {
                    icon: '💪',
                    label: 'Exercice pratique',
                    color: Colors.success,
                    description: 'Mettez en pratique ce que vous avez appris.',
                };
            case 'project':
                return {
                    icon: '🎯',
                    label: 'Projet',
                    color: Colors.primary,
                    description: 'Réalisez un projet complet pour valider vos compétences.',
                };
            default:
                return {
                    icon: '📚',
                    label: 'Activité',
                    color: Colors.primary,
                    description: 'Complétez cette activité.',
                };
        }
    };

    const typeInfo = getActivityTypeInfo();

    const handleComplete = async () => {
        if (isCompleted) {
            Alert.alert('Déjà complété', 'Vous avez déjà terminé cette activité !');
            return;
        }

        Alert.alert(
            'Marquer comme terminé',
            `Avez-vous terminé "${foundActivity.title}" ?\n\nVous gagnerez ${foundActivity.xp} XP.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Terminé',
                    onPress: async () => {
                        setIsCompleting(true);
                        try {
                            await completeActivity(foundModule.id, foundActivity.id, foundActivity.xp);
                            await addXP(foundActivity.xp);

                            Alert.alert(
                                '🎉 Bravo !',
                                `Activité terminée !\n\n+${foundActivity.xp} XP`,
                                [
                                    {
                                        text: 'Continuer',
                                        onPress: () => router.back(),
                                    },
                                ]
                            );
                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de marquer comme terminé');
                        } finally {
                            setIsCompleting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: foundActivity.title,
                    headerStyle: { backgroundColor: foundModule.color },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: '700' },
                }}
            />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header de l'activité */}
                    <LinearGradient
                        colors={[typeInfo.color, typeInfo.color + '90']}
                        style={styles.activityHeader}
                    >
                        <Text style={styles.activityIcon}>{typeInfo.icon}</Text>
                        <Text style={styles.activityType}>{typeInfo.label}</Text>
                        <Text style={styles.activityTitle}>{foundActivity.title}</Text>

                        <View style={styles.activityMeta}>
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={16} color="#fff" />
                                <Text style={styles.metaText}>{foundActivity.duration} min</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Ionicons name="star-outline" size={16} color="#fff" />
                                <Text style={styles.metaText}>{foundActivity.xp} XP</Text>
                            </View>
                        </View>

                        {isCompleted && (
                            <View style={styles.completedBadge}>
                                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                <Text style={styles.completedText}>Terminé</Text>
                            </View>
                        )}
                    </LinearGradient>

                    {/* Description */}
                    <View style={styles.section}>
                        <Card>
                            <Text style={styles.description}>{typeInfo.description}</Text>
                        </Card>
                    </View>

                    {/* Contenu de la leçon */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📚 Contenu</Text>

                        {loadingContent ? (
                            <Card style={styles.contentCard}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                                <Text style={styles.loadingText}>Chargement du contenu...</Text>
                            </Card>
                        ) : (
                            <>
                                {(foundActivity.type === 'lecture' || foundActivity.type === 'video') && lessonContent && (
                                    <>
                                        {lessonContent.introduction && (
                                            <Card style={styles.contentCard}>
                                                <Text style={styles.contentTitle}>Introduction</Text>
                                                <Text style={styles.contentText}>{lessonContent.introduction}</Text>
                                            </Card>
                                        )}

                                        {lessonContent.sections.map((section, index) => (
                                            <Card key={index} style={styles.contentCard}>
                                                <Text style={styles.contentTitle}>{section.title}</Text>
                                                <Text style={styles.contentText}>{section.content}</Text>
                                            </Card>
                                        ))}

                                        {lessonContent.key_points.length > 0 && (
                                            <Card style={styles.keyPointsCard}>
                                                <Text style={styles.keyPointsTitle}>🎯 Points clés à retenir</Text>
                                                {lessonContent.key_points.map((point, index) => (
                                                    <View key={index} style={styles.keyPointItem}>
                                                        <Text style={styles.keyPointBullet}>•</Text>
                                                        <Text style={styles.keyPointText}>{point}</Text>
                                                    </View>
                                                ))}
                                            </Card>
                                        )}

                                        {lessonContent.practical_tips.length > 0 && (
                                            <Card style={styles.tipsCard}>
                                                <Text style={styles.tipsTitle}>💡 Conseils pratiques</Text>
                                                {lessonContent.practical_tips.map((tip, index) => (
                                                    <View key={index} style={styles.tipItem}>
                                                        <Text style={styles.tipBullet}>✓</Text>
                                                        <Text style={styles.tipText}>{tip}</Text>
                                                    </View>
                                                ))}
                                            </Card>
                                        )}
                                    </>
                                )}

                                {foundActivity.type === 'quiz' && quizContent && (
                                    <QuizComponent quiz={quizContent} onComplete={handleQuizComplete} />
                                )}

                                {foundActivity.type === 'quiz' && !quizContent && (
                                    <Card style={styles.contentCard}>
                                        <Text style={styles.contentTitle}>Quiz non disponible</Text>
                                        <Text style={styles.contentText}>
                                            Le contenu du quiz n'est pas encore disponible. Revenez plus tard.
                                        </Text>
                                    </Card>
                                )}

                                {(foundActivity.type === 'lecture' || foundActivity.type === 'video') && !lessonContent && (
                                    <Card style={styles.contentCard}>
                                        <Text style={styles.contentTitle}>Contenu en construction</Text>
                                        <Text style={styles.contentText}>
                                            Le contenu détaillé de cette leçon sera bientôt disponible.
                                        </Text>
                                    </Card>
                                )}

                                {foundActivity.type === 'exercise' && (
                                    <Card style={styles.contentCard}>
                                        <Text style={styles.contentTitle}>Instructions</Text>
                                        <Text style={styles.contentText}>
                                            Suivez ces étapes pour réaliser l'exercice :
                                            {'\n\n'}
                                            1. Préparez votre matériel
                                            {'\n'}
                                            2. Suivez les consignes détaillées
                                            {'\n'}
                                            3. Prenez le temps nécessaire
                                            {'\n'}
                                            4. Soumettez votre travail
                                            {'\n\n'}
                                            Une fois terminé, marquez l'exercice comme complété.
                                        </Text>
                                    </Card>
                                )}

                                {foundActivity.type === 'project' && (
                                    <Card style={styles.contentCard}>
                                        <Text style={styles.contentTitle}>Projet</Text>
                                        <Text style={styles.contentText}>
                                            Ce projet vous permettra de mettre en pratique tout ce que vous avez
                                            appris dans ce module.
                                            {'\n\n'}
                                            Prenez le temps de bien planifier votre travail et n'hésitez pas à
                                            demander de l'aide si nécessaire.
                                        </Text>
                                    </Card>
                                )}
                            </>
                        )}
                    </View>

                    {/* Ressources supplémentaires */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📎 Ressources</Text>
                        <Card>
                            <TouchableOpacity style={styles.resourceItem}>
                                <Ionicons name="document-text-outline" size={24} color={Colors.primary} />
                                <View style={styles.resourceInfo}>
                                    <Text style={styles.resourceTitle}>Support de cours (PDF)</Text>
                                    <Text style={styles.resourceSubtitle}>À télécharger</Text>
                                </View>
                                <Ionicons name="download-outline" size={20} color={Colors.textSecondary} />
                            </TouchableOpacity>

                            <View style={styles.resourceDivider} />

                            <TouchableOpacity style={styles.resourceItem}>
                                <Ionicons name="link-outline" size={24} color={Colors.primary} />
                                <View style={styles.resourceInfo}>
                                    <Text style={styles.resourceTitle}>Ressources externes</Text>
                                    <Text style={styles.resourceSubtitle}>Liens utiles</Text>
                                </View>
                                <Ionicons
                                    name="open-outline"
                                    size={20}
                                    color={Colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </Card>
                    </View>

                    {/* Conseils du mentor */}
                    <View style={styles.section}>
                        <Card style={styles.mentorCard}>
                            <Text style={styles.mentorIcon}>💡</Text>
                            <Text style={styles.mentorTitle}>Conseil du mentor</Text>
                            <Text style={styles.mentorText}>
                                Prenez votre temps pour bien comprendre chaque concept. N'hésitez pas à
                                revenir sur les points qui vous semblent difficiles. La pratique régulière
                                est la clé de la réussite !
                            </Text>
                        </Card>
                    </View>

                    {/* Boutons d'action */}
                    {foundActivity.type !== 'quiz' && (
                        <View style={styles.actionSection}>
                            {!isCompleted ? (
                                <Button
                                    title={`✓ Marquer comme terminé (+${foundActivity.xp} XP)`}
                                    onPress={handleComplete}
                                    loading={isCompleting}
                                    size="large"
                                />
                            ) : (
                                <View style={styles.completedSection}>
                                    <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
                                    <Text style={styles.completedMessage}>
                                        Activité terminée ! Vous avez gagné {foundActivity.xp} XP
                                    </Text>
                                    <Button
                                        title="Retour au module"
                                        onPress={() => router.back()}
                                        variant="outline"
                                    />
                                </View>
                            )}
                        </View>
                    )}
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
    activityHeader: {
        padding: 24,
        paddingTop: 32,
        gap: 12,
        alignItems: 'center',
    },
    activityIcon: {
        fontSize: 64,
    },
    activityType: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    activityTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    activityMeta: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    metaText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.success,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 8,
    },
    completedText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
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
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    contentCard: {
        gap: 16,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    contentText: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    videoPlaceholder: {
        aspectRatio: 16 / 9,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    videoPlaceholderText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    resourceInfo: {
        flex: 1,
    },
    resourceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    resourceSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    resourceDivider: {
        height: 1,
        backgroundColor: Colors.border,
    },
    mentorCard: {
        backgroundColor: Colors.primaryLight + '20',
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    mentorIcon: {
        fontSize: 32,
    },
    mentorTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 8,
    },
    mentorText: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginTop: 8,
    },
    actionSection: {
        padding: 16,
    },
    completedSection: {
        alignItems: 'center',
        gap: 16,
    },
    completedMessage: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 12,
    },
    keyPointsCard: {
        backgroundColor: Colors.primaryLight + '15',
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
    },
    keyPointsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    keyPointItem: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    keyPointBullet: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary,
    },
    keyPointText: {
        flex: 1,
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
    tipsCard: {
        backgroundColor: Colors.warning + '15',
        borderLeftWidth: 4,
        borderLeftColor: Colors.warning,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 12,
    },
    tipItem: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    tipBullet: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.warning,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
});