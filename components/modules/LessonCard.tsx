import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Activity } from '@/types/module.types';
import { Colors } from '@/constants/Colors';

interface LessonCardProps {
    activity: Activity;
    onPress: () => void;
    completed?: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({
    activity,
    onPress,
    completed = false,
}) => {
    const getActivityIcon = () => {
        switch (activity.type) {
            case 'lecture': return '📖';
            case 'video': return '🎥';
            case 'quiz': return '❓';
            case 'exercise': return '💪';
            case 'project': return '🎯';
        }
    };

    const getActivityLabel = () => {
        switch (activity.type) {
            case 'lecture': return 'Cours';
            case 'video': return 'Vidéo';
            case 'quiz': return 'Quiz';
            case 'exercise': return 'Exercice';
            case 'project': return 'Projet';
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, completed && styles.completed]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.icon}>
                <Text style={styles.iconText}>{getActivityIcon()}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.type}>{getActivityLabel()}</Text>
                <Text style={styles.title} numberOfLines={2}>
                    {activity.title}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.duration}>⏱️ {activity.duration} min</Text>
                    <Text style={styles.xp}>⭐ {activity.xp} XP</Text>
                </View>
            </View>

            {completed && (
                <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    completed: {
        backgroundColor: Colors.success + '10',
        borderColor: Colors.success,
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: Colors.surface,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 24,
    },
    content: {
        flex: 1,
        gap: 4,
    },
    type: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    duration: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    xp: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.xpGold,
    },
    checkmark: {
        width: 24,
        height: 24,
        backgroundColor: Colors.success,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkIcon: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
});