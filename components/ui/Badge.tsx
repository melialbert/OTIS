import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
    label: string;
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'small' | 'medium' | 'large';
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'primary',
    size = 'medium',
}) => {
    return (
        <View style={[styles.badge, styles[variant], styles[size]]}>
            <Text style={[styles.text, styles[`${size}Text`]]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    primary: {
        backgroundColor: Colors.primary + '20',
    },
    success: {
        backgroundColor: Colors.success + '20',
    },
    warning: {
        backgroundColor: Colors.warning + '20',
    },
    error: {
        backgroundColor: Colors.error + '20',
    },
    info: {
        backgroundColor: Colors.info + '20',
    },
    small: {
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    medium: {
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    large: {
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    text: {
        fontWeight: '600',
        color: Colors.primary,
    },
    smallText: {
        fontSize: 10,
    },
    mediumText: {
        fontSize: 12,
    },
    largeText: {
        fontSize: 14,
    },
});