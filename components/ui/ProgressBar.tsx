import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ProgressBarProps {
    progress: number;
    color?: string;
    height?: number;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    color = Colors.primary,
    height = 8,
    showLabel = false,
}) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <View style={styles.container}>
            <View style={[styles.track, { height }]}>
                <View
                    style={[
                        styles.fill,
                        {
                            width: `${clampedProgress}%`,
                            backgroundColor: color,
                            height,
                        },
                    ]}
                />
            </View>
            {showLabel && (
                <Text style={styles.label}>{Math.round(clampedProgress)}%</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    track: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 999,
        overflow: 'hidden',
    },
    fill: {
        borderRadius: 999,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        minWidth: 35,
    },
});