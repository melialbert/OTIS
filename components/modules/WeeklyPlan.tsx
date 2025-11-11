import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Week } from '@/types/module.types';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';

interface WeeklyPlanProps {
    week: Week;
    currentDay?: number;
}

export const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ week, currentDay = 1 }) => {
    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.weekNumber}>Semaine {week.weekNumber}</Text>
                <Text style={styles.totalXP}>⭐ {week.totalXP} XP</Text>
            </View>

            <Text style={styles.title}>{week.title}</Text>
            <Text style={styles.objective}>{week.objective}</Text>

            <View style={styles.days}>
                {week.days.map((day) => (
                    <View
                        key={day.dayNumber}
                        style={[
                            styles.day,
                            day.dayNumber === currentDay && styles.currentDay,
                            day.completed && styles.completedDay,
                        ]}
                    >
                        <View style={styles.dayNumber}>
                            <Text style={styles.dayNumberText}>{day.dayNumber}</Text>
                        </View>
                        <View style={styles.dayContent}>
                            <Text style={styles.dayTitle} numberOfLines={1}>
                                {day.title}
                            </Text>
                            <Text style={styles.dayXP}>{day.xp} XP</Text>
                        </View>
                    </View>
                ))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weekNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        textTransform: 'uppercase',
    },
    totalXP: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.xpGold,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    objective: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    days: {
        gap: 8,
        marginTop: 8,
    },
    day: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 8,
        backgroundColor: Colors.surface,
        borderRadius: 8,
    },
    currentDay: {
        backgroundColor: Colors.primary + '20',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    completedDay: {
        backgroundColor: Colors.success + '20',
    },
    dayNumber: {
        width: 32,
        height: 32,
        backgroundColor: Colors.primary,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    dayContent: {
        flex: 1,
    },
    dayTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    dayXP: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
});