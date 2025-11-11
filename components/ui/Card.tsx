import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: any;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
    if (onPress) {
        return (
            <TouchableOpacity
                style={[styles.card, style]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
});