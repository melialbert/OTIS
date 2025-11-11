import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';

interface XPGaugeProps {
    currentXP: number;
    xpToNextLevel: number;
    level: number;
}

export const XPGauge: React.FC<XPGaugeProps> = ({
    currentXP,
    xpToNextLevel,
    level,
}) => {
    const progress = (currentXP / xpToNextLevel) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.level}>Niveau {level}</Text>
                <Text style={styles.xpText}>
                    {currentXP} / {xpToNextLevel} XP
                </Text>
            </View>

            <View style={styles.track}>
                <LinearGradient
                    colors={[Colors.xpGold, Colors.xpBronze]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.fill, { width: `${progress}%` }]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    level: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    xpText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    track: {
        height: 12,
        backgroundColor: Colors.surface,
        borderRadius: 999,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 999,
    },
});